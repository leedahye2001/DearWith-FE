"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner/Spinner";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    });

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main>
      <Spinner />
    </main>
  );
}
