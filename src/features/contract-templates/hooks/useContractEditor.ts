"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  parseContractBody,
  toContractFields,
  type ContractField,
} from "../helpers/contractBody";
import type { ContractTemplate } from "../types/interfaces/contractTemplateInterface";

/** One draft per template, so two half-filled contracts never collide. */
const storageKey = (docId: string) => `monsif:contract-draft:${docId}`;

/**
 * A saved draft, or nothing. Every failure mode — a private window, cleared
 * site data, a draft written by an older version — resolves to an empty form
 * rather than blocking the editor.
 */
const readDraft = (docId: string): Record<number, string> => {
  try {
    const saved = window.localStorage.getItem(storageKey(docId));
    return saved ? (JSON.parse(saved) as Record<number, string>) : {};
  } catch {
    return {};
  }
};

/**
 * Holds the answers to a template's blanks.
 *
 * The draft is mirrored into localStorage because these documents are long —
 * the median template has 28 blanks and the largest has 85 — and losing that
 * to a refresh would be the single worst thing this screen could do. It stays
 * on the user's machine: the values name real parties and there is no endpoint
 * that wants them.
 */
export function useContractEditor(
  /** Known from the URL, so the draft can be restored before the body arrives. */
  docId: string,
  template: ContractTemplate | undefined,
) {
  const [values, setValues] = useState<Record<number, string>>({});

  const fields: ContractField[] = useMemo(
    () => (template ? toContractFields(parseContractBody(template.body)) : []),
    [template],
  );

  // Restoring has to happen after mount, not in a lazy initialiser: this
  // component is server-rendered first, where `localStorage` does not exist,
  // and seeding state from it during render would make the client's first
  // paint disagree with the server's and trip a hydration mismatch on every
  // filled input. The effect is the SSR-safe placement, so the setState rule
  // is waived here specifically.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setValues(readDraft(docId)), [docId]);

  useEffect(() => {
    if (!docId) return;

    try {
      window.localStorage.setItem(storageKey(docId), JSON.stringify(values));
    } catch {
      // Storage full or unavailable; the editor still works in memory.
    }
  }, [docId, values]);

  const setValue = useCallback((index: number, value: string) => {
    setValues((current) => ({ ...current, [index]: value }));
  }, []);

  const clear = useCallback(() => {
    setValues({});
    if (!docId) return;
    try {
      window.localStorage.removeItem(storageKey(docId));
    } catch {
      // Nothing to do — the in-memory reset above is what the user sees.
    }
  }, [docId]);

  const filledCount = fields.filter((field) =>
    values[field.index]?.trim(),
  ).length;

  return {
    fields,
    values,
    setValue,
    clear,
    filledCount,
    totalCount: fields.length,
    /** The first unanswered blank, for the "jump to next" affordance. */
    firstEmptyIndex: fields.find((field) => !values[field.index]?.trim())?.index,
    isComplete: fields.length > 0 && filledCount === fields.length,
  };
}
