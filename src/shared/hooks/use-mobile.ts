import * as React from "react";

const MOBILE_BREAKPOINT = 768;

const subscribe = (onStoreChange: () => void) => {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
};

const getSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT;

/** Server snapshot is `false`: SSR renders the desktop sidebar, as before. */
const getServerSnapshot = () => false;

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
