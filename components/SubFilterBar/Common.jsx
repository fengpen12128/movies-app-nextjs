'use client'

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useFilterState(key, defaultValue) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(key) || defaultValue);

  const updateQuery = useCallback(
    (newValue) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (newValue === "all") {
        current.delete(key);
      } else {
        current.set(key, newValue);
      }
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${window.location.pathname}${query}`);
    },
    [key, router, searchParams]
  );

  const handleChange = useCallback(
    (newValue) => {
      setValue(newValue);
      updateQuery(newValue);
    },
    [updateQuery]
  );

  return [value, handleChange];
}
