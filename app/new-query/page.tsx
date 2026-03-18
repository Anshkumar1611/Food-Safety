"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAppState } from "@/context/app-state-context";
import { QUERY_TYPE_TEMPLATES } from "@/utils/query-templates";
import type { QueryType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const queryTypes = Object.keys(QUERY_TYPE_TEMPLATES) as QueryType[];

const formSchema = z.object({
  supplierId: z.string().min(1, "Select a supplier"),
  queryType: z.enum([
    "Allergen Info",
    "HACCP",
    "Certificate Expiry",
    "Traceability",
    "Microbiological",
    "Other",
  ]),
  priority: z.enum(["High", "Medium", "Low"]),
  description: z
    .string()
    .min(20, "Add at least 20 characters so suppliers can act on this.")
    .max(8000, "Description is too long."),
  file: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function NewQueryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSupplier = searchParams.get("supplier") ?? "";
  const { suppliers, addQuery } = useAppState();

  const defaultType = useMemo(() => "Certificate Expiry" as QueryType, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplierId: preSupplier,
      queryType: defaultType,
      priority: "Medium",
      description: QUERY_TYPE_TEMPLATES[defaultType],
      file: undefined,
    },
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (preSupplier && suppliers.some((s) => s.id === preSupplier)) {
      setValue("supplierId", preSupplier);
    }
  }, [preSupplier, suppliers, setValue]);

  const queryType = watch("queryType");
  const prevType = useRef(queryType);

  useEffect(() => {
    if (prevType.current !== queryType) {
      prevType.current = queryType;
      const t = QUERY_TYPE_TEMPLATES[queryType];
      setValue("description", t, { shouldValidate: true });
    }
  }, [queryType, setValue]);

  const onSubmit = (data: FormValues) => {
    const fileName =
      data.file && data.file.length > 0 ? data.file[0]?.name : null;
    const id = addQuery({
      supplierId: data.supplierId,
      type: data.queryType,
      priority: data.priority,
      description: data.description,
      fileName,
    });
    router.push(`/queries/${id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2 gap-1" asChild>
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to suppliers
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Raise a query</h1>
        <p className="mt-1 text-muted-foreground">
          Templates pre-fill the description — edit before sending.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Query details</CardTitle>
          <CardDescription>
            All fields help QA route and prioritize supplier responses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="supplierId">Supplier</Label>
              <Select
                value={watch("supplierId")}
                onValueChange={(v) =>
                  setValue("supplierId", v, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  id="supplierId"
                  className={cn(errors.supplierId && "border-destructive")}
                  aria-invalid={!!errors.supplierId}
                >
                  <SelectValue placeholder="Choose supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplierId && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.supplierId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="queryType">Query type</Label>
              <Select
                value={watch("queryType")}
                onValueChange={(v) =>
                  setValue("queryType", v as QueryType, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="queryType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {queryTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={watch("priority")}
                onValueChange={(v) =>
                  setValue("priority", v as FormValues["priority"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={8}
                className={cn(errors.description && "border-destructive")}
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Attachment (optional)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg"
                {...register("file")}
              />
              <p className="text-xs text-muted-foreground">
                Mock upload — file name will appear on the query record.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[140px] font-semibold"
              >
                {isSubmitting ? "Submitting…" : "Submit query"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/queries">View all queries</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewQueryPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-96 rounded-xl bg-muted" />
        </div>
      }
    >
      <NewQueryForm />
    </Suspense>
  );
}
