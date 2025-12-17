"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Forward from "@/svgs/Forward.svg";
import Spinner from "@/components/Spinner/Spinner";
import { getSystemNotices } from "@/apis/api";

interface SystemNoticeItem {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
};

export default function SystemNoticesPage() {
  const router = useRouter();

  const [notices, setNotices] = useState<SystemNoticeItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await getSystemNotices();

        setNotices(res?.content ?? []);
        setTotalElements(res?.totalElements ?? 0);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
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
          <p className="text-[14px] font-[600] text-text-5">등록된 공지사항</p>
          <span className="text-[12px] font-[600] text-text-3">
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
                <div>
                  <h1 className="text-[14px] font-[600] text-text-5">
                    {notice.title}
                  </h1>
                  <div className="flex items-center gap-[4px] mt-[4px] text-[12px] text-text-4">
                    <span>{formatDate(notice.updatedAt)}</span>
                  </div>
                </div>

                <Forward />
              </div>
            ))
          ) : (
            <div className="min-h-[calc(100vh-100px)] flex justify-center items-center text-[14px] text-text-4">
              등록된 공지사항이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
