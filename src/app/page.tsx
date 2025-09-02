"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Page from "./loading/page";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main>
      <Page />
    </main>
  );
}
