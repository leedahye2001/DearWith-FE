"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner/Spinner";
import { validateToken } from "@/apis/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        await validateToken();
        router.replace("/main");
      } catch {
        router.replace("/login");
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  return (
    <main>
      <Spinner />
    </main>
  );
}
