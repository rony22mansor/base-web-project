import * as React from "react";

import { cn } from "@/src/core/utils/utils";

/**
 * Notion's text input: 36px tall, 4px radius, a hairline border that firms up
 * on hover and turns blue with a 2px halo on focus. It previously had no focus
 * treatment at all, which left keyboard users with no visible target.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-input-filled-color text-foreground placeholder:text-placeHolder selection:bg-link-bg file:text-foreground",
        "flex h-9 w-full min-w-0 rounded-sm border border-input ps-3 pe-3 text-base md:text-sm",
        // Placeholder alignment follows the site's own direction — not the
        // field's `dir`, which for `dir="auto"` fields defaults to LTR while
        // empty and would otherwise left-align an Arabic placeholder in an
        // RTL interface. `rtl:`/`ltr:` key off the page's `dir`, so this holds
        // regardless of what the field itself resolves to once typed into.
        "placeholder:text-left rtl:placeholder:text-right",
        "transition-[color,border-color,box-shadow] duration-120 ease-gentle outline-none",
        "hover:border-border-strong focus-visible:border-link focus-visible:ring-2 focus-visible:ring-ring/35",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:bg-muted disabled:text-text-tertiary disabled:pointer-events-none disabled:cursor-not-allowed",
        "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/30",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
