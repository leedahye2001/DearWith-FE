"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Backward from "@/svgs/Backward.svg";
import Button from "@/components/Button/Button";
import Bottombar from "@/components/template/Bottombar";
import Topbar from "@/components/template/Topbar";
import { useAgreementStore } from "@/app/stores/userStore";
import Spinner from "@/components/Spinner/Spinner";

const BOTTOM_THRESHOLD = 24;

export default function PrivacyPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const setAgreements = useAgreementStore((s) => s.setAgreements);

  useEffect(() => {
    fetch("/api/privacy-policy")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.text();
      })
      .then(setHtml)
      .catch(() => setHtml("<p>내용을 불러올 수 없습니다.</p>"))
      .finally(() => setLoading(false));
  }, []);

  const checkReachedBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const hasScroll = scrollHeight > clientHeight + 1;
    const atBottom = hasScroll
      ? scrollTop >= scrollHeight - clientHeight - BOTTOM_THRESHOLD
      : true;
    setHasReachedBottom(atBottom);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setHasReachedBottom(false);
    checkReachedBottom();
    const t = setTimeout(checkReachedBottom, 100);
    el.addEventListener("scroll", checkReachedBottom);
    const ro = new ResizeObserver(checkReachedBottom);
    ro.observe(el);
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", checkReachedBottom);
      ro.disconnect();
    };
  }, [html, checkReachedBottom]);

  const handleAgree = () => {
    const current = useAgreementStore.getState();
    setAgreements({
      item1: current.item1,
      item2: current.item2,
      item3: true,
      item4: current.item4,
      item5: current.item5,
    });
    router.back();
  };

  return (
    <div className="bg-bg-1 flex flex-col h-full min-h-0">
      <Topbar
        _leftImage={
          <button type="button" onClick={() => router.back()} aria-label="뒤로">
            <Backward />
          </button>
        }
        _topNode="개인정보처리방침"
      />
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-[24px] py-[16px] pb-[100px]"
        style={{ overscrollBehavior: "contain" }}
      >
        {loading ? (
          <Spinner />
        ) : (
          <div
            className="text-text-5 [&_*]:text-text-5 [&_h1]:text-[16px] [&_h1]:font-[600] [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-[14px] [&_h2]:font-[600] [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-[12px] [&_h3]:font-[600] [&_p]:text-[12px] [&_p]:leading-[1.5] [&_p]:mb-2 [&_ul]:text-[12px] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:text-[12px] [&_li]:mb-1 [&_table]:w-full [&_th]:text-[12px] [&_th]:font-[600] [&_td]:text-[12px] [&_td]:py-1 [&_hr]:my-3 [&_hr]:border-divider-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="동의하기"
            _buttonProps={{
              className: `w-full ${hasReachedBottom ? "hover:cursor-pointer" : "opacity-50 cursor-not-allowed"}`,
              disabled: !hasReachedBottom,
            }}
            _onClick={handleAgree}
          />
        }
      />
    </div>
  );
}
