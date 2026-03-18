"use client";

import { memo, useRef, useEffect } from "react";
import { format, parseISO } from "date-fns";
import type { QueryComment } from "@/types";
import { cn } from "@/lib/utils";

export const ConversationThread = memo(function ConversationThread({
  comments,
}: {
  comments: QueryComment[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  if (comments.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No messages yet.
      </p>
    );
  }

  return (
    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
      {comments.map((c, i) => {
        const isYou = c.author === "You";
        return (
          <div
            key={c.id}
            className={cn(
              "flex",
              isYou ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm",
                isYou
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md border bg-muted/60"
              )}
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    isYou ? "text-primary-foreground/90" : "text-foreground"
                  )}
                >
                  {c.author}
                </span>
                <time
                  className={cn(
                    "text-[10px] opacity-80",
                    isYou ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                  dateTime={c.createdAt}
                >
                  {format(parseISO(c.createdAt), "MMM d, HH:mm")}
                </time>
              </div>
              <p
                className={cn(
                  "mt-1 whitespace-pre-wrap text-sm leading-relaxed",
                  isYou ? "text-primary-foreground" : "text-foreground"
                )}
              >
                {c.body}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
});
