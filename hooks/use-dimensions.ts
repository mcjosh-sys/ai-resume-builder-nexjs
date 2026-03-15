"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RefCallBack } from "react-hook-form";

export const useDimensions = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const observer = useRef<ResizeObserver | null>(null);

  const targetRef: RefCallBack = useCallback((node: HTMLElement) => {
    if (node) {
      setTarget(node);
    }
  }, []);

  useEffect(() => {
    if (!target) return;
    observer.current = new ResizeObserver((entries) => {
      const entry = entries[0];
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.current?.observe(target);

    return () => {
      observer.current?.disconnect();
    };
  }, [target]);

  return { targetRef, dimensions };
};
