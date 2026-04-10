"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/stores/admin-store";

export function useAdminData() {
  const store = useAdminStore();

  useEffect(() => {
    store.initMockData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store;
}
