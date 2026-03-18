"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
  ArrowLeft,
  FileText,
  Paperclip,
  SendHorizontal,
} from "lucide-react";
import { useAppState } from "@/context/app-state-context";
import type { QueryStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { QueryStatusBadge } from "@/components/query/status-badge";
import { PriorityBadge } from "@/components/query/priority-badge";
import { QueryTimeline } from "@/components/query/query-timeline";
import { ConversationThread } from "@/components/query/conversation-thread";
export default function QueryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { getQueryById, addComment, updateQueryStatus } = useAppState();
  const query = getQueryById(id);
  const [comment, setComment] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  if (!query) {
    notFound();
  }

  const onSendComment = useCallback(() => {
    const t = comment.trim();
    if (!t) return;
    addComment(query.id, t);
    setComment("");
  }, [comment, addComment, query.id]);

  const onStatusChange = useCallback(
    (status: QueryStatus) => {
      setStatusUpdating(true);
      updateQueryStatus(query.id, status);
      requestAnimationFrame(() => setStatusUpdating(false));
    },
    [query.id, updateQueryStatus]
  );

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" className="-ml-2 gap-1" asChild>
        <Link href="/queries">
          <ArrowLeft className="h-4 w-4" />
          All queries
        </Link>
      </Button>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {query.supplierName}
            </h1>
            <QueryStatusBadge status={query.status} />
            <PriorityBadge priority={query.priority} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {query.type} · Created{" "}
            {format(parseISO(query.createdAt), "MMM d, yyyy · HH:mm")}
          </p>
        </div>
        <Card className="w-full border-primary/20 bg-primary/[0.04] lg:max-w-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Update status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Select
              value={query.status}
              onValueChange={(v) => onStatusChange(v as QueryStatus)}
              disabled={statusUpdating}
            >
              <SelectTrigger aria-label="Query status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Review">In review</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Status updates append to the timeline below.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {query.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              {query.attachments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No files attached.
                </p>
              ) : (
                <ul className="space-y-2">
                  {query.attachments.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2 text-sm"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <span className="font-medium">{a.name}</span>
                      <span className="text-muted-foreground">
                        {a.sizeLabel}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ConversationThread comments={query.comments} />
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="comment">Add comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Message supplier or internal note…"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      onSendComment();
                    }
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    className="gap-2 font-semibold"
                    onClick={onSendComment}
                    disabled={!comment.trim()}
                  >
                    <SendHorizontal className="h-4 w-4" />
                    Send
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⌘/Ctrl + Enter to send
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Status timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <QueryTimeline
                currentStatus={query.status}
                statusHistory={query.statusHistory}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
