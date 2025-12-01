"use client";

import { useRouter } from "next/navigation";
import { EventNotice } from "../[id]/page";

interface NoticeListProps {
  notices: EventNotice[];
  eventId: string; // 추가 (id 받아야 이동 가능)
}

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yy}.${mm}.${dd} ${hh}:${min}`;
};

export default function NoticeList({ notices, eventId }: NoticeListProps) {
  const router = useRouter();

  return (
    <div className="w-full mt-[16px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-[12px]">
        <h2 className="text-[16px] font-[700] text-text-5">공지사항</h2>
        <button
          onClick={() => router.push(`/notice-list/${eventId}`)}
          className="text-[12px] font-[500] text-text-3"
        >
          더 보기
        </button>
      </div>

      {/* 리스트 */}
      {Array.isArray(notices) && notices.length > 0 ? (
        notices.map((notice) => (
          <div
            onClick={() => router.push(`/notice-detail/${notice.id}`)}
            key={notice?.id}
            className="flex flex-col justify-start items-start border border-divider-1 rounded-[4px] p-[12px] w-full mb-[8px]"
          >
            <p className="text-[14px] font-[500] text-text-5 line-clamp-1">
              {notice?.title}
            </p>
            <span className="text-[12px] text-text-4">
              {formatDate(notice?.createdAt)}
            </span>
          </div>
        ))
      ) : (
        <div className="flex flex-col justify-center items-center border border-divider-1 rounded-[4px] p-[12px] text-text-5 font-[500] text-[14px]">
          등록된 공지사항이 없습니다.
        </div>
      )}
    </div>
  );
}
