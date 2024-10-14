'use client'

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useFilterState(key: string, defaultValue: string): [string, (newValue: string) => void] {
  // 这个钩子管理过滤器的状态，并将其与 URL 查询参数同步。
  // 它提供一个状态值和一个更新状态的函数，该函数也会更新 URL。
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string>(searchParams.get(key) || defaultValue);

  const updateQuery = useCallback(
    (newValue: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (newValue === "all") {
        current.delete(key);
      } else {
        current.set(key, newValue);
      }
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${window.location.pathname}${query}` as any);
    },
    [key, router, searchParams]
  );

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      updateQuery(newValue);
    },
    [updateQuery]
  );

  return [value, handleChange];
}
