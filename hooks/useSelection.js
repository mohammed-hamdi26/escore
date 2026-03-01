"use client";

import { useState, useCallback, useMemo, useEffect } from "react";

export function useSelection(resetKey) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    setSelectedIds(new Set());
  }, [resetKey]);

  const isSelected = useCallback((id) => selectedIds.has(id), [selectedIds]);

  const toggle = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((ids) => {
    setSelectedIds(new Set(ids));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const toggleAll = useCallback(
    (ids) => {
      setSelectedIds((prev) => {
        const allSelected = ids.length > 0 && ids.every((id) => prev.has(id));
        return allSelected ? new Set() : new Set(ids);
      });
    },
    []
  );

  const isAllSelected = useCallback(
    (ids) => ids.length > 0 && ids.every((id) => selectedIds.has(id)),
    [selectedIds]
  );

  const isPartialSelected = useCallback(
    (ids) => {
      const someSelected = ids.some((id) => selectedIds.has(id));
      const allSelected = ids.length > 0 && ids.every((id) => selectedIds.has(id));
      return someSelected && !allSelected;
    },
    [selectedIds]
  );

  const count = selectedIds.size;
  const selectionMode = count > 0;

  return useMemo(
    () => ({
      selectedIds,
      isSelected,
      toggle,
      selectAll,
      deselectAll,
      toggleAll,
      isAllSelected,
      isPartialSelected,
      count,
      selectionMode,
    }),
    [selectedIds, isSelected, toggle, selectAll, deselectAll, toggleAll, isAllSelected, isPartialSelected, count, selectionMode]
  );
}
