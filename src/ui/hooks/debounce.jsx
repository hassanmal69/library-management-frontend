// ============================================================
//  useDebounce.js  –  reusable debounce hook
//
//  USAGE:
//  const debouncedValue = useDebounce(value, 400);
// ============================================================

import { useState, useEffect } from "react";

/**
 * useDebounce
 * Returns a debounced copy of `value` that only updates
 * after `delay` ms of inactivity.
 *
 * @param {any}    value  – the value to debounce
 * @param {number} delay  – delay in ms (default 400)
 * @returns debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}