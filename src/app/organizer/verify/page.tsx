"use client";

import { useXAuthStore } from "@/app/stores/useXAuthStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuthData = useXAuthStore((state) => state.setAuthData);
  const setVerified = useXAuthStore((state) => state.setVerified);

  const result = searchParams?.get("result") ?? "";
  const ticket = searchParams?.get("ticket") ?? "";
  const handle = searchParams?.get("handle") ?? "";

  useEffect(() => {
    if (result && ticket && handle) {
      setAuthData({ result, ticket, handle });
      if (result === "success") {
        setVerified(true); // 인증 성공 상태
        router.push("/event-register");
      }
    }
  }, [result, ticket, handle, setAuthData, setVerified, router]);

  return <div>OAuth 인증 처리중...</div>;
}
