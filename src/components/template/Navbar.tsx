"use client";

import { useRouter, usePathname } from "next/navigation";
import { isNativeApp } from "@/lib/native/bridge";
import { useEffect, useState } from "react";
import Home from "@/svgs/Home.svg";
import Search from "@/svgs/Search.svg";
import HeartDefault from "@/svgs/HeartDefault.svg";
import Person from "@/svgs/Person.svg";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(isNativeApp());
  }, []);

  const navbarHeight = isNative 
    ? 'calc(60px + env(safe-area-inset-bottom))' 
    : 'calc(80px + env(safe-area-inset-bottom))';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 w-full max-w-[428px] mx-auto bg-white flex justify-center items-center gap-[48px] z-50 shadow-[0_-32px_32px_rgba(0,0,0,0.03)]"
      style={{
        height: navbarHeight,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* 홈 */}
      <button
        className="flex flex-col justify-center items-center"
        onClick={() => router.push("/main")}
      >
        <Home
          className={pathname === "/main" ? "text-primary" : "text-icon-2"}
        />
        <span
          className={`text-[12px] mt-[4px] ${
            pathname === "/main" ? "text-primary" : "text-icon-2"
          }`}
        >
          홈
        </span>
      </button>

      {/* 검색 */}
      <button
        className="flex flex-col justify-center items-center"
        onClick={() => router.push("/search")}
      >
        <Search
          className={pathname === "/search" ? "text-primary" : "text-icon-2"}
        />
        <span
          className={`text-[12px] mt-[4px] ${
            pathname === "/search" ? "text-primary" : "text-icon-2"
          }`}
        >
          검색
        </span>
      </button>

      {/* 찜 */}
      <button
        className="flex flex-col justify-center items-center"
        onClick={() => router.push("/event-bookmark/event")}
      >
        <HeartDefault
          className={
            pathname?.startsWith("/event-bookmark") ? "text-primary" : "text-icon-2"
          }
        />
        <span
          className={`text-[12px] mt-[4px] ${
            pathname?.startsWith("/event-bookmark") ? "text-primary" : "text-icon-2"
          }`}
        >
          찜
        </span>
      </button>

      {/* 마이 */}
      <button
        className="flex flex-col justify-center items-center"
        onClick={() => router.push("/my-page")}
      >
        <Person
          className={pathname === "/my-page" ? "text-primary" : "text-icon-2"}
        />
        <span
          className={`text-[12px] mt-[4px] ${
            pathname === "/my-page" ? "text-primary" : "text-icon-2"
          }`}
        >
          마이
        </span>
      </button>
    </div>
  );
}
