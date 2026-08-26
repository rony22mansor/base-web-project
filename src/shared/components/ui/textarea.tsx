import * as React from "react";

import { cn } from "@/src/core/utils/utils";

/**
 * `dir="auto"` by default, overridable per usage: this is a bilingual app and
 * the long-form fields take Arabic case facts even when the interface is in
 * English. Without it the first strong character decides nothing and Arabic
 * typed into an LTR box strands its punctuation at the wrong end.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      dir="auto"
      className={cn(
        "bg-input-filled-color text-foreground placeholder:text-placeHolder",
        "flex field-sizing-content min-h-16 w-full rounded-sm border border-input px-3 py-2 text-base md:text-sm",
        // Placeholder alignment follows the site's own direction, not
        // `dir="auto"` above — an empty field with no strong-direction
        // character resolves that to LTR, which would left-align an Arabic
        // placeholder in an RTL interface. `rtl:`/`ltr:` key off the page's
        // `dir` instead, so this holds regardless of what gets typed in.
        "placeholder:text-left rtl:placeholder:text-right",
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
