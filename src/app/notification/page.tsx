"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import { getAlertMessage } from "@/apis/api";
import { formatDate } from "../(events)/event-detail/components/NoticeList";
import Image from "next/image";
import Spinner from "@/components/Spinner/Spinner";

import { isNativeApp, requestPushPermissionStatus, requestPushPermission } from "@/lib/native/bridge";
import { loadPushPermission } from "@/lib/native/NativeBridgeProvider";

interface AlertItem {
  id: number;
  type: string;
  title: string;
  content: string;
  linkUrl: string;
  targetId?: number;
  read: boolean;
  readAt: string | null;
  createdAt: string;
  coverImage?: Array<{
    id: string | null;
    variants: Array<{ name: string; url: string }>;
  }>;
}

export default function Page() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [permEnabled, setPermEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setPermEnabled(loadPushPermission());

    if (isNativeApp()) {
      requestPushPermissionStatus();
    }
  }, []);

  const showBanner = useMemo(() => {
    if (!isNativeApp()) return false;
    if (permEnabled === null) return false;
    return permEnabled === false;
  }, [permEnabled]);

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

  const onClickEnable = () => {
    if (!isNativeApp()) {
      alert("앱에서만 알림 설정을 열 수 있어요.");
      return;
    }

    const ok = requestPushPermission();
    if (!ok) {
      alert("앱에서만 알림을 켤 수 있어요.");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Topbar */}
      <Topbar
        _leftImage={<Backward onClick={() => router.back()} />}
        _topNode="알림"
      />

      {/* 앱에서만 + enabled=false일 때만 배너 */}
      {showBanner && (
        <div className="bg-secondary-200 mx-[24px] px-[12px] py-[16px] flex justify-between items-center rounded-[4px] mt-[12px]">
          <p className="text-text-5 text-[12px] font-[500]">기기 알림을 켜고 소식을 받아보세요!</p>
          <button
            onClick={onClickEnable}
            className="bg-red-400 text-white px-[8px] py-[6px] rounded-[4px] text-[12px] font-[600]"
          >
            알림 켜기
          </button>
        </div>
      )}

      <div className="px-[24px] py-[20px] flex flex-col gap-[16px]">
        {loading ? (
          <Spinner />
        ) : alerts.length === 0 ? (
          <div className="flex justify-center items-center h-[60vh]">
            <p className="text-text-3 text-[14px]">알림이 없습니다.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const imageUrl = alert.coverImage?.[0]?.variants?.[0]?.url;

            return (
              <div
                key={alert.id}
                className="flex justify-between items-start border-b pb-[16px] border-divider-1 cursor-pointer"
                onClick={() => {
                  if (!alert.linkUrl) return;
                  if (alert.linkUrl.startsWith("http")) window.location.href = alert.linkUrl;
                  else router.push(alert.linkUrl);
                }}
              >
                <div className="flex gap-[10px] flex-1 min-w-0">
                  {imageUrl ? (
                    <div className="w-[16px] h-[16px] rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={imageUrl}
                        width={16}
                        height={16}
                        alt={alert.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-[16px] h-[16px] bg-gray-200 rounded-full flex-shrink-0" />
                  )}

                  <div className="flex flex-col items-start gap-[4px] min-w-0">
                    <p className="text-[12px] text-text-3 font-[500] whitespace-nowrap">
                      {alert.title}
                    </p>
                    <p className="text-[14px] text-text-5 font-[600] truncate">
                      {alert.content}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-text-3 whitespace-nowrap mt-[4px]">
                  {formatDate(alert.createdAt).slice(0, 8)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
