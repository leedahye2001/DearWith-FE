"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isNativeApp } from "@/lib/native/bridge";
import Navbar from "@/components/template/Navbar";
import AlertModalClient from "../Modal/AlertModal/AlertModalClient";

type Props = {
  children: React.ReactNode;
};

const NAVBAR_PATHS = ["/main", "/search", "/event-bookmark", "/my-page"];

// 화면을 꽉 채우는 페이지 목록 (이 페이지들에서만 스크롤 조건부 적용)
const FULL_SCREEN_PATHS = [
  "/login",
  "/mail-send",
  "/mail-verify",
  "/password",
  "/mail-nickname",
  "/social-nickname",
  "/agreement",
  "/signup-complete",
  "/set-nickname",
  "/find-password",
  "/search",
];

// 톱바를 쓰지 않는 경로만 (이 경로에서만 상단 48px 블록 생략, 나머지는 톱바 영역 확보)
const PATHS_WITHOUT_TOPBAR = [
  "/event-bookmark/event",
  "/event-bookmark/artist",
  "/my-page",
];

export default function LayoutClient({ children }: Props) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartTimeRef = useRef<number>(0);

  useEffect(() => {
    setIsNative(isNativeApp());
  }, []);

  // 스와이프 제스처로 뒤로가기
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      // 왼쪽 가장자리 50px 이내에서 시작해야 함
      if (touch.clientX <= 50) {
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        touchStartTimeRef.current = Date.now();
      }
    };

    const handleTouchMove = () => {
      // 스와이프 중에는 기본 동작 허용 (스크롤 등)
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
      const deltaTime = Date.now() - touchStartTimeRef.current;

      // 수평 스와이프가 수직보다 크고, 최소 50px 이상, 300ms 이내
      if (
        deltaX > 50 &&
        deltaX > deltaY &&
        deltaTime < 300 &&
        touchStartRef.current.x <= 50
      ) {
        // 뒤로가기
        router.back();
      }

      touchStartRef.current = null;
    };

    const container = contentRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: true });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });

      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [router]);

  const showNavbar = useMemo(
    () => NAVBAR_PATHS.includes(pathname) || pathname?.startsWith("/event-bookmark"),
    [pathname],
  );

  const isFullScreenPage = useMemo(
    () => FULL_SCREEN_PATHS.includes(pathname),
    [pathname],
  );

  // 톱바가 있는 경로에서만 상단 48px 영역 확보 (agreement, find-password 등 톱바 쓰는 경로 포함)
  const hasTopbar = useMemo(
    () => !PATHS_WITHOUT_TOPBAR.includes(pathname),
    [pathname],
  );

  const navbarHeight = isNative ? '60px' : '80px';

  useEffect(() => {
    // 전체 화면 페이지가 아니면 스크롤 체크하지 않음
    if (!isFullScreenPage) {
      setNeedsScroll(false);
      return;
    }

    const checkScroll = () => {
      if (!contentRef.current) return;

      const container = contentRef.current;
      const containerHeight = container.clientHeight;
      const contentHeight = container.scrollHeight;

      // 내용이 컨테이너보다 약간이라도 크면 스크롤 필요
      setNeedsScroll(contentHeight > containerHeight + 1);
    };

    checkScroll();

    // ResizeObserver로 내용 변경 감지
    const resizeObserver = new ResizeObserver(checkScroll);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    // 윈도우 리사이즈도 감지
    window.addEventListener('resize', checkScroll);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkScroll);
    };
  }, [children, showNavbar, isFullScreenPage]);

  // 전체 화면 페이지에서 터치 스크롤 완전히 차단
  useEffect(() => {
    if (!isFullScreenPage || needsScroll) return;

    const preventTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('input') || target.closest('textarea')) {
        return;
      }

      e.preventDefault();
    };

    const preventWheel = (e: WheelEvent) => {
      if (!needsScroll) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    document.addEventListener('wheel', preventWheel, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventTouchMove);
      document.removeEventListener('wheel', preventWheel);
    };
  }, [isFullScreenPage, needsScroll]);

  return (
    <div
      className="relative w-full max-w-[428px] mx-auto flex flex-col"
      style={{
        height: '100dvh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        right: 0,
        bottom: 0,
      }}
    >
      {/* 톱바 있는 화면만: 상단 48px 고정, 스크롤은 그 아래만 */}
      {hasTopbar && (
        <div className="shrink-0 h-[48px] w-full" aria-hidden />
      )}
      {/* 중간 콘텐츠만 스크롤 (톱바 없으면 전체 높이) */}
      <div
        ref={contentRef}
        className={`w-full flex-1 min-h-0 ${isFullScreenPage ? 'flex flex-col' : ''}`}
        style={{
          overflowY: isFullScreenPage && !needsScroll ? 'hidden' : 'auto',
          overflowX: 'hidden',
          paddingBottom: showNavbar ? `calc(${navbarHeight} + env(safe-area-inset-bottom))` : '0',
          overscrollBehavior: 'none',
          touchAction: isFullScreenPage && !needsScroll ? 'none' : 'pan-y',
        }}
      >
        <div
          className={isFullScreenPage ? 'flex-1 flex flex-col' : ''}
          style={{
            marginBottom: isNative ? '100px' : '0',
          }}
        >
          {children}
        </div>
      </div>
      <AlertModalClient />
      {showNavbar && <Navbar />}
    </div>
  );
}
