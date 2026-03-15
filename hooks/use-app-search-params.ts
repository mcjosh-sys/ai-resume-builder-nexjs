"use client";

import { buildSearchParams } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export const useAppSearchParams = ({
  watchKeys: initialWatchKeys = [],
}: {
  watchKeys?: string[];
} = {}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [watchKeys, setWatchKeys] = useState<string[]>(initialWatchKeys);

  const values = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const watchValues = useMemo(() => {
    const nextValues = watchKeys.reduce(
      (acc: Record<string, string | null>, key: string) => {
        acc[key] = values[key] ?? null;
        return acc;
      },
      {} as Record<string, string | null>,
    );
    return nextValues;
  }, [values, watchKeys]);

  const stableWatchValues = useMemo(() => {
    return watchValues;
  }, [JSON.stringify(watchValues)]);

  const watch = useCallback(
    (keys: string | string[], { replace = false } = {}) => {
      const nextKeys = Array.isArray(keys) ? keys : [keys];
      setWatchKeys((prev: string[]) =>
        replace ? nextKeys : [...new Set([...prev, ...nextKeys])],
      );
    },
    [],
  );

  const unwatch = useCallback((keys: string | string[]) => {
    const removeKeys = Array.isArray(keys) ? keys : [keys];
    setWatchKeys((prev: string[]) =>
      prev.filter((key) => !removeKeys.includes(key)),
    );
  }, []);

  const setValues = useCallback(
    (newValues: Record<string, any>, { replace = false } = {}) => {
      const next = replace ? newValues : { ...values, ...newValues };

      const cleaned = Object.fromEntries(
        Object.entries(next).filter(
          ([_, value]) => value !== undefined && value !== null && value !== "",
        ),
      );

      const search = buildSearchParams(cleaned);
      const url = search ? `?${search}` : window.location.pathname;

      const currentSearch = window.location.search.replace(/^\?/, "");
      if (search === currentSearch) return;

      if (replace) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [values],
  );

  return {
    values,
    watch,
    unwatch,
    watchString: buildSearchParams(stableWatchValues),
    watchValues: stableWatchValues,
    setValues,
  };
};
