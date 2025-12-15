 "use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/template/Navbar";
import AlertModalClient from "@/components/AlertModal/AlertModalClient";

type Props = {
  children: React.ReactNode;
};

const NAVBAR_PATHS = ["/main", "/search", "/event-bookmark", "/my-page"];

export default function LayoutClient({ children }: Props) {
  const pathname = usePathname() ?? "";

  const showNavbar = useMemo(
    () => NAVBAR_PATHS.includes(pathname),
    [pathname],
  );

  return (
    <div className="relative">
      <div
        className={`w-full max-w-[428px] mx-auto ${
          showNavbar ? "pb-[80px]" : ""
        }`}
      >
        {children}
      </div>
      <AlertModalClient />
      {showNavbar && <Navbar />}
    </div>
  );
}
