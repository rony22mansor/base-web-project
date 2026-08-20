import * as React from "react";

import { cn } from "@/src/core/utils/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "bg-input-filled-color text-foreground placeholder:text-placeHolder",
        "flex field-sizing-content min-h-16 w-full rounded-sm border border-input px-3 py-2 text-base md:text-sm",
        "transition-[color,border-color,box-shadow] duration-120 ease-gentle outline-none",
        "hover:border-border-strong focus-visible:border-link focus-visible:ring-2 focus-visible:ring-ring/35",
        "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/30",
        "disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
