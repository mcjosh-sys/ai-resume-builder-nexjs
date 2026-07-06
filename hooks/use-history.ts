"use client";

import { useCallback, useRef, useState } from "react";

export type HistoryState<T> = {
  /** The current value */
  present: T;
  /**
   * Push a new state snapshot, clearing the redo stack.
   * Accepts either a value or a function updater `(current: T) => T`
   * (mirrors React's setState signature to avoid stale closures).
   */
  push: (next: T | ((current: T) => T)) => void;
  /** Replace the present snapshot without recording a new history entry */
  replace: (next: T | ((current: T) => T)) => void;
  /** Undo to the previous snapshot */
  undo: () => void;
  /** Redo to the next snapshot */
  redo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Reset to a fresh initial state, clearing all history */
  reset: (initial: T) => void;
};

const MAX_HISTORY = 50;

/**
 * A generic undo/redo history hook.
 *
 * Maintains a past[], present, and future[] stack. `push` records a new
 * snapshot (supports functional updaters to avoid stale closures) and clears
 * the redo stack. `undo`/`redo` travel through history. `reset` wipes history.
 *
 * All returned functions are stable (empty useCallback deps) — safe to put in
 * useEffect/useCallback dependency arrays without causing re-render loops.
 */
export function useHistory<T>(initialValue: T): HistoryState<T> {
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);
  const [present, setPresent] = useState<T>(initialValue);

  const push = useCallback((next: T | ((current: T) => T)) => {
    setPresent((current) => {
      const nextValue = typeof next === "function" ? (next as (c: T) => T)(current) : next;
      pastRef.current = [...pastRef.current, current].slice(-MAX_HISTORY);
      futureRef.current = [];
      return nextValue;
    });
  }, []);

  const replace = useCallback((next: T | ((current: T) => T)) => {
    setPresent((current) =>
      typeof next === "function" ? (next as (c: T) => T)(current) : next,
    );
  }, []);

  const undo = useCallback(() => {
    setPresent((current) => {
      const past = pastRef.current;
      if (past.length === 0) return current;

      const previous = past[past.length - 1];
      pastRef.current = past.slice(0, -1);
      futureRef.current = [current, ...futureRef.current].slice(0, MAX_HISTORY);
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    setPresent((current) => {
      const future = futureRef.current;
      if (future.length === 0) return current;

      const next = future[0];
      futureRef.current = future.slice(1);
      pastRef.current = [...pastRef.current, current].slice(-MAX_HISTORY);
      return next;
    });
  }, []);

  const reset = useCallback((initial: T) => {
    pastRef.current = [];
    futureRef.current = [];
    setPresent(initial);
  }, []);

  return {
    present,
    push,
    replace,
    undo,
    redo,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    reset,
  };
}
