"use client";

import { notifyTaskComplete } from "@/src/core/services/notifications/browserNotifications";
import { useEffect, useRef } from "react";

interface UseTaskCompletionNotificationOptions {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  /** Identifies the task so a repeat run replaces its own notification. */
  tag: string;
  successTitle: string;
  successBody?: string;
  errorTitle: string;
  errorBody?: string;
}

/**
 * Fires a browser notification the moment a tracked request finishes — a
 * ruling prediction, a cases or laws search — so a reader who switched tabs
 * during the 10s-to-a-minute wait finds out without having to check back.
 *
 * Firing correctly means firing exactly on the transition: not on mount with
 * a result already cached (React Query can hand back `isSuccess: true`
 * immediately from cache), and not again on every render while `isLoading`
 * stays true. A ref remembers whether the *previous* render was mid-request,
 * so only a true → false transition it actually observed counts as "just
 * finished".
 *
 * Copy is passed as flat strings rather than a `{title, body}` object so the
 * effect's dependency list stays primitives — a fresh object literal from the
 * caller on every render would otherwise re-run this effect constantly.
 *
 * Whether the reader actually needs telling — permission, tab visibility — is
 * `notifyTaskComplete`'s decision, not this hook's.
 */
export function useTaskCompletionNotification({
  isLoading,
  isSuccess,
  isError,
  tag,
  successTitle,
  successBody,
  errorTitle,
  errorBody,
}: UseTaskCompletionNotificationOptions) {
  const wasLoading = useRef(false);

  useEffect(() => {
    if (isLoading) {
      wasLoading.current = true;
      return;
    }

    const justFinished = wasLoading.current;
    wasLoading.current = false;
    if (!justFinished) return;

    if (isSuccess) {
      notifyTaskComplete({ title: successTitle, body: successBody, tag });
    } else if (isError) {
      notifyTaskComplete({ title: errorTitle, body: errorBody, tag });
    }
  }, [
    isLoading,
    isSuccess,
    isError,
    tag,
    successTitle,
    successBody,
    errorTitle,
    errorBody,
  ]);
}
