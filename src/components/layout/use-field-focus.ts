"use client";

import { useEffect, useState } from "react";

const FIELD = "input, textarea, select, [contenteditable='true']";

/**
 * True while a form field has focus — on phones, the on-screen keyboard is
 * probably open — so fixed bars and buttons can get out of the way. Fields
 * inside `ignore` (a CSS selector) don't count.
 */
export function useFieldFocus(ignore?: string) {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const isField = (target: EventTarget | null) =>
      target instanceof HTMLElement && target.matches(FIELD) && !(ignore && target.closest(ignore));
    const onFocusIn = (event: FocusEvent) => {
      if (isField(event.target)) setFocused(true);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (isField(event.target)) setFocused(false);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [ignore]);

  return focused;
}
