"use client";

import { splitRedactions } from "@/src/core/utils/functions/redaction";
import { cn } from "@/src/core/utils/utils";
import { useTranslations } from "next-intl";

/** Roles the corpus uses. Anything else is printed verbatim, never guessed. */
type PartyRole =
  | "defendant"
  | "plaintiff"
  | "witness"
  | "judge"
  | "lawyer"
  | "person";

const KNOWN_ROLES: readonly string[] = [
  "defendant",
  "plaintiff",
  "witness",
  "judge",
  "lawyer",
  "person",
];

const toRole = (role?: string): PartyRole | null =>
  role && KNOWN_ROLES.includes(role) ? (role as PartyRole) : null;

/**
 * A judgment body, with its redacted parties rendered as labelled chips.
 *
 * Forced to RTL: the corpus is Arabic whatever language the interface is in,
 * so this text reads right-to-left even for a reader browsing in English.
 * Without it the trailing full stop and every embedded date or article number
 * jump to the wrong end of the line.
 *
 * `<DEFENDANT_1>` reads as a broken template in the middle of Arabic prose;
 * "المدعى عليه 1" reads as what it is — a party whose name was removed before
 * the corpus was published. The chip keeps parties visually distinct from the
 * court's own words, and an unrecognised token falls through unchanged.
 */
export function RedactedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const t = useTranslations("legal.redaction");
  const segments = splitRedactions(text);

  return (
    <p
      dir="rtl"
      className={cn("text-sm leading-7 whitespace-pre-line", className)}
    >
      {segments.map((segment, position) => {
        if (segment.kind === "text") {
          return <span key={position}>{segment.value}</span>;
        }

        const role = toRole(segment.role);

        return (
          <span
            key={position}
            className="bg-tag-gray text-tag-gray-fg mx-0.5 rounded-sm px-1.5 py-0.5 text-xs font-medium"
            title={t("redactedTitle")}
          >
            {role
              ? t("party", { role: t(role), index: segment.index ?? 1 })
              : segment.value}
          </span>
        );
      })}
    </p>
  );
}
