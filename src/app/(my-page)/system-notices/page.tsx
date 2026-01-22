"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Forward from "@/svgs/Forward.svg";
import Write from "@/svgs/Write.svg";
import Spinner from "@/components/Spinner/Spinner";
import { getSystemNotices, getUserInfo } from "@/apis/api";
import { FAB } from "@/components/FAB/FAB";

interface SystemNoticeItem {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  important: boolean;
}

const formatDate = (isoString: string | null | undefined) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  // Invalid Date 체크
  if (isNaN(date.getTime())) return "";

  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yy}.${mm}.${dd}`;
};

export default function SystemNoticesPage() {
  const router = useRouter();

  const [notices, setNotices] = useState<SystemNoticeItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noticesRes, userInfoRes] = await Promise.all([
          getSystemNotices(),
          getUserInfo(),
        ]);

        setNotices(noticesRes?.content ?? []);
        setTotalElements(noticesRes?.totalElements ?? 0);
        setIsAdmin(userInfoRes?.isAdmin ?? false);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="bg-bg-1 min-h-screen">
      <Topbar
        _leftImage={
          <button onClick={() => router.back()}>
            <Backward />
          </button>
        }
        _topNode="공지사항"
      />
      <div className="px-[24px]">
        <div className="flex gap-[6px] justify-start items-center my-[16px]">
          <p className="typo-label2 text-text-5">등록된 공지사항</p>
          <span className="typo-label3 text-text-3">
            {totalElements}
          </span>
        </div>
        <div className="flex flex-col gap-[10px]">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <div
                key={notice.id}
                className="flex justify-between items-center border-b py-[12px] border-divider-1 cursor-pointer"
                onClick={() => router.push(`/system-notice-detail/${notice.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-[8px]">
                    {notice.important && (
                      <span className="px-[6px] py-[2px] typo-label3 rounded-[4px] bg-red-400 text-text-1 flex-shrink-0">
                        필독
                      </span>
                    )}
                    <h1 className="typo-label2 text-text-5">
                      {notice.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-[4px] mt-[4px] typo-caption3 text-text-4">
                    <p>디어위드 | </p>
                    <span>{formatDate(notice.createdAt)}</span>
                  </div>
                </div>

                <Forward />
              </div>
            ))
          ) : (
            <div className="min-h-[calc(100vh-100px)] flex justify-center items-center typo-body2 text-text-4">
              등록된 공지사항이 없습니다.
            </div>
          )}
        </div>
      </div>
      {isAdmin && (
        <FAB
          _icon={<Write />}
          _onClick={() => router.push("/system-notice-register")}
        />
      )}
    </div>
  );
}
