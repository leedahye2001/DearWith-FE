"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import { getAlertMessage } from "@/apis/api";
import { formatDate } from "../(events)/event-detail/components/NoticeList";
import Image from "next/image";
import Spinner from "@/components/Spinner/Spinner";

interface AlertItem {
  id: number;
  type: string;
  title: string;
  content: string;
  linkUrl: string;
  targetId: number;
  read: boolean;
  readAt: string;
  createdAt: string;
}

export default function Page() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await getAlertMessage();
      setAlerts(res ?? []);
    } catch (err) {
      console.error("알림 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Topbar */}
      <Topbar
        _leftImage={<Backward onClick={() => router.back()} />}
        _topNode="알림"
      />

      <div className="px-[24px] py-[20px] flex flex-col gap-[16px]">
        {loading ? (
          <Spinner />
        ) : alerts.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh]">
            <p className="text-text-3 text-[14px]">알림이 없습니다.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex justify-between items-start border-b pb-[16px] border-divider-1"
            >
              {/* 좌측 아이콘 + 텍스트 영역 */}
              <div className="flex gap-[10px]">
                <Image
                  src={alert.linkUrl}
                  width={16}
                  height={16}
                  alt={alert.title}
                />

                <div className="flex flex-col">
                  <p className="text-[12px] text-text-3 font-[500]">
                    {alert.title}
                  </p>
                  <p className="text-[14px] text-text-5 font-[600]">
                    {alert.content}
                  </p>
                </div>
              </div>

              {/* 날짜 */}
              <p className="text-[11px] text-text-3 whitespace-nowrap mt-[4px]">
                {formatDate(alert.createdAt).slice(0, 8)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
