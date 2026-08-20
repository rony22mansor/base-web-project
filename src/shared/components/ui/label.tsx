"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@/src/core/utils/utils";

function Label({
  className,
  isActive, // ✅ إضافة prop جديد لتغيير اللون ديناميكيًا
  error, // ✅ إضافة prop لتغيير اللون عند وجود خطأ
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  isActive?: boolean;
  error?: boolean;
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 leading-none font-bold select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        // ✅ اللون يعتمد على الحالة
        error ? "text-destructive" : isActive ? "text-white" : "text-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
