"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Etc from "@/svgs/Etc.svg";
import { getAlertMessage, deleteNotification, patchNotificationsReadAll, deleteAllNotifications } from "@/apis/api";
import { formatDate } from "../(events)/event-detail/components/NoticeList";
import Image from "next/image";
import { isNativeApp, requestPushPermissionStatus, requestPushPermission } from "@/lib/native/bridge";
import { loadPushPermission } from "@/lib/native/NativeBridgeProvider";
import useModalStore from "../stores/useModalStore";
import ToggleItem from "../(my-page)/components/ToggleItem";
import { AxiosError } from "axios";
import NotificationSkeleton from "./components/NotificationSkeleton";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import RefreshIcon from "@/components/Icons/RefreshIcon";

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
  const { openAlert } = useModalStore();
  const [permEnabled, setPermEnabled] = useState<boolean | null>(null);
  const [pushToggleOn, setPushToggleOn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const enabled = loadPushPermission();
    setPermEnabled(enabled);
    setPushToggleOn(enabled ?? false);
    if (isNativeApp()) {
      requestPushPermissionStatus();
    }
  }, []);

  useEffect(() => {
    if (permEnabled === null) return;
    setPushToggleOn(permEnabled);
  }, [permEnabled]);

  // const showBanner = useMemo(() => {
  //   if (!isNativeApp()) return false;
  //   if (permEnabled === null) return false;
  //   return permEnabled === false;
  // }, [permEnabled]);

  const fetchAlerts = async () => {
    try {
      const res = await getAlertMessage();
      setAlerts(res ?? []);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "알림 조회에 실패했습니다. 다시 시도해주세요.";
      openAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const { rootRef, pullOffset, isPulling, isRefreshing, showRefreshIndicator } = usePullToRefresh(fetchAlerts);

  const handleDeleteAlert = async (e: React.MouseEvent, alertId: number) => {
    e.stopPropagation();
    setIsMenuOpen(null);
    try {
      await deleteNotification(alertId);
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "알림 읽음 처리에 실패했습니다. 다시 시도해주세요.";
      openAlert(errorMessage);
    };
  };

  const toggleDropdown = (e: React.MouseEvent, alertId: number) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => (prev === alertId ? null : alertId));
  };

  useEffect(() => {
    if (isMenuOpen === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setIsMenuOpen(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  const goToLink = (alert: AlertItem) => {
    if (!alert.linkUrl) return;
    const url = alert.linkUrl.includes("?")
      ? `${alert.linkUrl}&notificationId=${alert.id}`
      : `${alert.linkUrl}?notificationId=${alert.id}`;
    if (alert.linkUrl.startsWith("http")) window.location.href = alert.linkUrl;
    else router.push(url);
  };

  const onPushToggleChange = (newValue: boolean) => {
    if (newValue) {
      if (!isNativeApp()) {
        openAlert("앱에서만 알림 설정을 열 수 있어요.");
        return;
      }
      const ok = requestPushPermission();
      if (!ok) {
        openAlert("앱에서만 알림을 켤 수 있어요.");
        return;
      }
      setPushToggleOn(true);
    } else {
      setPushToggleOn(false);
    }
  };

  const handleReadAll = async () => {
    try {
      await patchNotificationsReadAll();
      await fetchAlerts();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "알림 읽음 처리에 실패했습니다. 다시 시도해주세요.";
      openAlert(errorMessage);
    };
  }

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications(false);
      setAlerts([]);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "알림 삭제 처리에 실패했습니다. 다시 시도해주세요.";
      openAlert(errorMessage);
    };
  };

  return (
    <div ref={rootRef} className="flex flex-col w-full min-h-screen bg-white">
      {/* Topbar */}
      <Topbar
        _leftImage={<Backward onClick={() => router.back()} />}
        _topNode="알림"
      />

      {/* 당겨서 새로고침: 톱바 하단 인디케이터 */}
      {showRefreshIndicator && (
        <div
          className="flex justify-center items-center w-full py-[20px] bg-white shrink-0"
          aria-live="polite"
          aria-busy={isRefreshing}
        >
          <RefreshIcon isRefreshing={isRefreshing} />
        </div>
      )}

      <div
        className="min-h-0 flex-1"
        style={{
          transform: pullOffset > 0 ? `translateY(${pullOffset}px)` : undefined,
          transition: isPulling ? "none" : "transform 0.25s ease-out",
        }}
      >
        <div className="mx-[24px] py-[16px] flex justify-between items-center rounded-[4px] mt-[12px]">
          <ToggleItem
            label=""
            defaultState={false}
            value={pushToggleOn}
            onChange={onPushToggleChange}
          />
          <div className="flex gap-[16px]">
            <button
              type="button"
              className="text-text-2 text-[12px] font-[500]"
              onClick={handleReadAll}
            >
              모두 읽음
            </button>
            <button
              type="button"
              className="text-text-2 text-[12px] font-[500]"
              onClick={handleDeleteAll}
            >
              모두 삭제
            </button>
          </div>
        </div>

        <div className="py-[20px] flex flex-col gap-[16px]">
          {loading ? (
            <NotificationSkeleton />
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
                  className="flex justify-between items-start border-b pb-[16px] border-divider-1 cursor-pointer px-[24px]"
                  onClick={() => goToLink(alert)}
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
                      <p
                        className={`typo-label3 font-[500] whitespace-nowrap ${alert.read ? "text-text-2" : "text-text-3"}`}
                      >
                        {alert.title}
                      </p>
                      <p
                        className={`typo-label2 font-[600] truncate ${alert.read ? "text-text-2" : "text-text-5"}`}
                      >
                        {alert.content}
                      </p>
                      <p className="typo-caption3 text-text-2 whitespace-nowrap mt-[4px]">
                        {formatDate(alert.createdAt).slice(0, 8)}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0" ref={isMenuOpen === alert.id ? dropdownRef : null}>
                    <button
                      type="button"
                      className="p-[4px] -m-[4px]"
                      onClick={(e) => toggleDropdown(e, alert.id)}
                      aria-label="더보기"
                      aria-expanded={isMenuOpen === alert.id}
                    >
                      <Etc />
                    </button>
                    {isMenuOpen === alert.id && (
                      <div
                        className="absolute right-0 top-full mt-[8px] bg-white rounded-[8px] z-[9999] w-[90px] border border-divider-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="w-full text-left px-[16px] py-[8px] text-text-5 hover:bg-gray-100 typo-label3"
                          onClick={(e) => handleDeleteAlert(e, alert.id)}
                        >
                          삭제하기
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
