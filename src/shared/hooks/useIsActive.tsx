"use client";
import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useIsActive(value: any) {
  const [isActive, setIsActive] = useState(false);

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(!!value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsActive(!!value); 
  }, [value]);

  return { isActive, handleFocus, handleBlur };
}
