import { Assets } from "@/src/assets/assets";
import { cn } from "@/src/core/utils/utils";
import Image from "next/image";

interface AppLogoProps {
  /** Rendered height in px; the width follows the mark's aspect ratio. */
  size?: number;
  className?: string;
  priority?: boolean;
}

/**
 * The MONSIF mark. It is a solid-black wordmark on transparency, so dark mode
 * inverts it rather than shipping a second file — same trick Notion uses for
 * its own monochrome logo.
 */
export function AppLogo({ size = 24, className, priority }: AppLogoProps) {
  return (
    <Image
      src={Assets.logoImage}
      alt=""
      aria-hidden
      height={size}
      width={Math.round((size * 775) / 615)}
      priority={priority}
      className={cn("object-contain dark:invert", className)}
      style={{ height: size, width: "auto" }}
    />
  );
}
