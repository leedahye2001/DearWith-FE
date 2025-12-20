"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // 기본적으로 이벤트 페이지로 리다이렉트
    router.replace("/event-bookmark/event");
  }, [router]);

  return null;
}
