"use client";

import { useEffect, useState } from "react";

export default function useSimpleDebounce<T>(
  value: T,
  { delay = 500 }: { delay?: number },
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
