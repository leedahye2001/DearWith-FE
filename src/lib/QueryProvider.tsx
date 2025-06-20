// app/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { RecoilRoot } from "recoil";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RecoilRoot>
  );
}
