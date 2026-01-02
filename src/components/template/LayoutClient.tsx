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
const FULL_SCREEN_PATHS = ["/login"];

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

  return (
    <div 
      className="relative w-full max-w-[428px] mx-auto"
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div
        ref={contentRef}
        className="w-full h-full"
        style={{
          overflowY: isFullScreenPage && !needsScroll ? 'visible' : 'auto',
          paddingBottom: showNavbar ? `calc(${navbarHeight} + env(safe-area-inset-bottom))` : '0',
        }}
      >
        <div
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
