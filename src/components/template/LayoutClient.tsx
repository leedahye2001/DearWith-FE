 "use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/template/Navbar";
import AlertModalClient from "../Modal/AlertModal/AlertModalClient";

type Props = {
  children: React.ReactNode;
};

const NAVBAR_PATHS = ["/main", "/search", "/event-bookmark", "/my-page"];

export default function LayoutClient({ children }: Props) {
  const pathname = usePathname() ?? "";

  const showNavbar = useMemo(
    () => NAVBAR_PATHS.includes(pathname) || pathname?.startsWith("/event-bookmark"),
    [pathname],
  );

  return (
    <div 
      className="relative w-full max-w-[428px] mx-auto"
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div
        className="w-full h-full overflow-y-auto"
        style={{
          paddingBottom: showNavbar ? 'calc(80px + env(safe-area-inset-bottom))' : '0',
        }}
      >
        {children}
      </div>
      <AlertModalClient />
      {showNavbar && <Navbar />}
    </div>
  );
}
