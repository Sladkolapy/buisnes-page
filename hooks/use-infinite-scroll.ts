"use client";

import { useEffect, useRef } from "react";

export function useInfiniteScroll(
  hasMore: boolean,
  isLoading: boolean,
  onLoadMore: () => void,
) {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return triggerRef;
}
