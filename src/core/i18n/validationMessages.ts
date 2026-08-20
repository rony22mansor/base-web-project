"use client";

import type messages from "@/src/shared/messages/en.json";
import { useTranslations } from "next-intl";

/**
 * Keys the Zod schemas emit as validation messages
 * (e.g. `z.string().nonempty("invalidEmail")`).
 */
export type ValidationErrorKey = keyof typeof messages.validationErrors;

/**
 * react-hook-form hands back `error.message` as a plain `string`, which
 * next-intl's typed keys reject. This narrows at that single boundary and
 * falls back to the raw string when a schema uses a key we haven't translated.
 */
export function useValidationMessage() {
  const t = useTranslations("validationErrors");

  return (key?: unknown): string => {
    if (typeof key !== "string" || key.length === 0) return "";
    return t.has(key as ValidationErrorKey)
      ? t(key as ValidationErrorKey)
      : key;
  };
}
