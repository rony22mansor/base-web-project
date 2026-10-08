/**
 * Thin wrapper over the browser's `Notification` API.
 *
 * Every export here is defensive about support and permission rather than
 * making the caller check first: SSR has no `Notification` global at all, and
 * most visits will never have granted permission, so both functions are safe
 * no-ops until they are not.
 */

const isSupported = (): boolean =>
  typeof window !== "undefined" && "Notification" in window;

/**
 * Ask for permission, but only if it has never been decided. Re-asking after
 * a denial does nothing — the browser blocks the prompt silently — and
 * re-asking after a grant is a wasted call, so this fires the browser's
 * permission prompt at most once per origin, ever.
 *
 * Call this from inside the event handler that starts the slow request (a
 * submit button's `onClick`, ultimately) and nowhere else: browsers require a
 * user gesture to show the permission prompt, and a call made later — from an
 * effect once the request is already in flight — is silently ignored.
 */
export function requestNotificationPermission(): void {
  if (!isSupported() || Notification.permission !== "default") return;
  void Notification.requestPermission();
}

export interface CompletionNotificationOptions {
  title: string;
  body?: string;
  /**
   * Groups repeat notifications from the same task so a second one replaces
   * the first instead of stacking — running the same search twice while away
   * from the tab should leave one notification, not two.
   */
  tag: string;
}

/**
 * Notify that a task finished. Fires whenever permission is granted,
 * regardless of whether the tab is currently visible/focused.
 */
export function notifyTaskComplete({
  title,
  body,
  tag,
}: CompletionNotificationOptions): void {
  if (!isSupported() || Notification.permission !== "granted") return;

  const notification = new Notification(title, { body, tag });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}
