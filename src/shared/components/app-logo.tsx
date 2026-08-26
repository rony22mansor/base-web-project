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
 *
 * Sourced from the @6x export — the highest-resolution file of the two the
 * mark was supplied at — so every size this component renders (18px in the
 * collapsed sidebar rail up to 52px on the home page header) downsamples from
 * more detail than it needs rather than upscaling. The @3x export is kept in
 * `Assets` for a future spot that wants a lighter file over quality, but
 * nothing currently needs it: this component already renders one source at
 * whatever `size` a caller asks for.
 */
export function AppLogo({ size = 24, className, priority }: AppLogoProps) {
  return (
    <Image
      src={Assets.logo_6xImage}
      alt=""
      aria-hidden
      height={size}
      width={Math.round((size * 645) / 542)}
      priority={priority}
      className={cn("object-contain dark:invert", className)}
      style={{ height: size, width: "auto" }}
    />
  );
}
