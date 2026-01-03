"use client";
import { Suspense } from "react";
import { useXAuthStore } from "@/app/stores/useXAuthStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/components/Spinner/Spinner";

function VerifyContent() {
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
        router.push(`https://dearwith.kr/event-register`);
      }
    }
  }, [result, ticket, handle, setAuthData, setVerified, router]);

  return <div>OAuth 인증 처리중...</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <VerifyContent />
    </Suspense>
  );
}
