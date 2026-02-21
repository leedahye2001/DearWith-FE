"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_PULL_THRESHOLD = 56;
const DEFAULT_MAX_PULL = 80;
const DEFAULT_SPIN_DURATION_MS = 1200;
/** 당길 때 시각적 이동 비율 (1보다 작으면 저항감) */
const PULL_RESISTANCE = 0.45;

export interface UsePullToRefreshOptions {
  pullThreshold?: number;
  maxPull?: number;
  spinDurationMs?: number;
}

export interface UsePullToRefreshReturn {
  rootRef: (node: HTMLDivElement | null) => void;
  pullDistance: number;
  /** 콘텐츠 translateY용 (저항 적용) */
  pullOffset: number;
  /** 터치 중인지 (트랜지션 끄기용) */
  isPulling: boolean;
  isRefreshing: boolean;
  showRefreshIndicator: boolean;
}

/**
 * 당겨서 새로고침: 스크롤이 맨 위일 때 아래로 당기면 onRefresh 호출.
 * LayoutClient의 스크롤 영역 내부에서 사용 (rootRef 부모의 부모가 스크롤 컨테이너).
 * ref가 나중에 붙는 페이지(예: 메인 로딩 후 마운트)에서도 동작하도록 callback ref 사용.
 */
export function usePullToRefresh(
  onRefresh: () => void | Promise<void>,
  options: UsePullToRefreshOptions = {}
): UsePullToRefreshReturn {
  const {
    pullThreshold = DEFAULT_PULL_THRESHOLD,
    maxPull = DEFAULT_MAX_PULL,
    spinDurationMs = DEFAULT_SPIN_DURATION_MS,
  } = options;

  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refKey, setRefKey] = useState(0);
  const elRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef(0);
  const pullDistanceRef = useRef(0);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const rootRef = useCallback((node: HTMLDivElement | null) => {
    elRef.current = node;
    if (node) setRefKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const getScrollParent = () => el.parentElement?.parentElement ?? null;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(false);
    };

    const onTouchMove = (e: TouchEvent) => {
      const scrollParent = getScrollParent();
      if (!scrollParent || scrollParent.scrollTop > 0) {
        if (pullDistanceRef.current > 0) {
          pullDistanceRef.current = 0;
          setPullDistance(0);
          setIsPulling(false);
        }
        return;
      }
      const deltaY = e.touches[0].clientY - touchStartY.current;
      if (deltaY > 0) {
        const value = Math.min(deltaY, maxPull);
        pullDistanceRef.current = value;
        setPullDistance(value);
        setIsPulling(true);
      }
    };

    const onTouchEnd = () => {
      const current = pullDistanceRef.current;
      pullDistanceRef.current = 0;
      setPullDistance(0);
      setIsPulling(false);
      if (current >= pullThreshold) {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(50);
        }
        setIsRefreshing(true);
        Promise.resolve(onRefreshRef.current()).finally(() => { });
        setTimeout(() => setIsRefreshing(false), spinDurationMs);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [refKey, pullThreshold, maxPull, spinDurationMs]);

  return {
    rootRef,
    pullDistance,
    pullOffset: Math.round(pullDistance * PULL_RESISTANCE),
    isPulling,
    isRefreshing,
    showRefreshIndicator: pullDistance > 0 || isRefreshing,
  };
}
