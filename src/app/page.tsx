"use client";

// import Page from "../app/(signup)/mail-send/page";
import Page from "./login/page";

export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="font-pretendard">
        <Page />
      </div>
    </main>
  );
}
