"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Share from "@/svgs/Share.svg";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";
import Etc from "@/svgs/Etc.svg";
import Twitter from "@/svgs/Twitter.svg";
import Clock from "@/svgs/Clock.svg";
import Place from "@/svgs/Place.svg";
import Calendar from "@/svgs/Calendar.svg";
import XVerification from "@/svgs/XVerification.svg";
import KakaoMap from "../components/KakaoMap";
import Image from "next/image";
import {
  deleteEventLike,
  getEventDetail,
  // getEventNoticeList,
  postEventLike,
  deleteEvent,
} from "@/apis/api";
import NoticeList from "../components/NoticeList";
import Spinner from "@/components/Spinner/Spinner";
import useModalStore from "@/app/stores/useModalStore";
import { WEB_BASE_URL } from "@/app/routePath";
import { AxiosError } from "axios";

export interface EventDetail {
  id: string;
  title: string;
  description: string;
  openTime: string;
  closeTime: string;
  startDate: string;
  endDate: string;
  place: {
    name: string;
    roadAddress: string;
    jibunAddress?: string;
    kakaoPlaceId: string;
    lon: number;
    lat: number;
  };
  images: {
    id: string;
    variants: { name: string; url: string }[];
  }[];
  artists: {
    id: number;
    nameKr: string;
    profileImageUrl: string;
  }[];
  artistGroups: {
    id: number;
    nameKr: string;
    profileImageUrl: string;
  }[];
  benefits: {
    name: string;
    benefitType: "INCLUDED" | "LIMITED";
    dayIndex?: number;
    displayOrder: number;
  }[];
  organizer: {
    verified: boolean;
    xHandle: string;
    xId?: string;
    xName?: string;
  };
  bookmarked: boolean;
  editable?: boolean;
  notices: {
    id: number;
    eventId: string;
    title: string;
    content: string;
    writerNickname: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface EventNotice {
  id: number;
  eventId: string;
  title: string;
  content: string;
  writerNickname: string;
  createdAt: string;
  updatedAt: string;
}

export default function EventDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromMain = searchParams?.get("from") === "main";

  const handleBackRouter = () => {
    if (fromMain) {
      router.push("/main");
    } else {
      router.back();
    }
  };
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openConfirmWithCustomButtons, openAlert } = useModalStore();

  // 클릭 시 토글
  const toggleBookmark = async () => {
    if (!id) return; // id 없으면 그냥 종료

    setIsBookmarked((prev) => !prev); // UI 즉시 반영

    try {
      if (!isBookmarked) {
        await postEventLike(id); // 서버에 북마크 등록
      } else {
        await deleteEventLike(id); // 서버에서 북마크 삭제
      }
    } catch (error) {
      console.error(error);
      // const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      // const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail;
      // openAlert(errorMessage);
      setIsBookmarked((prev) => !prev); // 실패하면 롤백
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const data = await getEventDetail(id);
        // const noticeData = await getEventNoticeList(id);
        setEvent(data);
        // setNotice(noticeData);
      } catch (error) {
        console.error(error);
        // const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
        // const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail;
        // openAlert(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event) {
      setIsBookmarked(event.bookmarked);
    }
  }, [event]);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  const isOpenNow = (openTime: string, closeTime: string) => {
    const _open = openTime ?? "10:00";
    const _close = closeTime ?? "23:00";

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = _open.split(":").map(Number);
    const [closeH, closeM] = _close.split(":").map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    router.push(`/event-register?edit=${id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteEvent(id);
      openAlert("이벤트가 삭제되었습니다.", () => {
        router.push("/main");
      });
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "이벤트가 삭제에 실패했습니다. 다시 시도해주세요.";
      openAlert(errorMessage);
    }
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    openConfirmWithCustomButtons(
      "이벤트를 삭제하시겠어요?",
      handleDelete,
      "삭제하기",
      "다음에 하기"
    );
  };

  const handleShare = () => {
    setIsMenuOpen(false);
    const shareUrl = `https://${WEB_BASE_URL}/event-detail/${id}`;
    const shareText = event?.title || "디어위드 이벤트";
    const payload = { text: shareText, url: shareUrl };

    // 1) iOS WebView
    if (typeof window !== "undefined" && window.webkit?.messageHandlers?.share) {
      window.webkit.messageHandlers.share.postMessage(payload);
      return;
    }

    // 2) Android WebView
    if (typeof window !== "undefined" && window.Android?.share) {
      window.Android.share(JSON.stringify(payload));
      return;
    }

    // 3) 일반 웹 브라우저 - Web Share API
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: shareText,
        text: shareText,
        url: shareUrl,
      }).catch((err) => {
        // 사용자가 공유를 취소한 경우 (AbortError)는 에러로 처리하지 않음
        if (err.name !== "AbortError") {
          console.error("공유 실패:", err);
        }
      });
      return;
    }

    // 4) 폴백: 클립보드에 복사
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        openAlert("링크가 클립보드에 복사되었습니다.");
      }).catch((err) => {
        console.error("클립보드 복사 실패:", err);
        openAlert("공유 기능을 사용할 수 없습니다.");
      });
    } else {
      openAlert("공유 기능을 사용할 수 없습니다.");
    }
  };

  if (isLoading) return <Spinner />;

  if (!event)
    return (
      <div className="flex justify-center items-center h-screen text-text-5">
        이벤트 정보를 찾을 수 없습니다.
      </div>
    );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${String(date.getFullYear()).slice(0)}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };


  const includedBenefits = event.benefits.filter(
    (b) => b.benefitType === "INCLUDED"
  );
  const limitedBenefits = event.benefits.filter(
    (b) => b.benefitType === "LIMITED"
  );

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center mb-[50px]">
      <Topbar
        _leftImage={
          <button onClick={handleBackRouter}>
            <Backward onClick={handleBackRouter} />
          </button>
        }
        _topNode={event.title}
      />

      {/* 탭 */}
      <div className="flex justify-around border-b border-divider-1 mt-[4px]">
        <button
          onClick={() => router.push(`/event-detail/${event.id}`)}
          className={`w-1/2 py-[12px] typo-label1 ${"text-primary border-b-[2px] border-primary"
            }`}
        >
          홈
        </button>
        <button
          onClick={() => router.push(`/event-detail/${event.id}/review`)}
          className={`w-1/2 py-[12px] typo-label1 ${"text-text-3"
            }`}
        >
          리뷰
        </button>
      </div>

      {event.images?.length > 0 && (
        <div className="relative w-full h-[536px]">
          <div
            className="w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
            style={{ touchAction: 'pan-x pan-y' }}
          >
            <div className="flex h-full">
              {event.images.map((img, idx) => {
                const url = img?.variants?.[0]?.url || null;

                return (
                  <div key={idx} className="relative min-w-full h-full flex-shrink-0 snap-center">
                    {url ? (
                      <Image
                        src={url}
                        alt={`${event.title}-${idx}`}
                        fill
                        className="object-cover"
                        style={{ touchAction: 'pan-x pan-y' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <p className="text-text-3 typo-caption3">이미지 없음</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 인덱스 표시 UI - 고정 */}
          <div className="absolute bottom-[12px] right-[12px] flex justify-center items-center px-[15px] py-[4px] rounded-[20px] bg-bg-1/80 text-text-5 typo-label3 pointer-events-none z-10">
            1
            <p className="text-text-3 font-[400]">
              &nbsp;|&nbsp;{event.images.length}
            </p>
          </div>
        </div>
      )}

      <div className="p-[12px]">
        <div className="flex justify-between items-center pb-[8px] pt-[28px]">
          <div className="flex gap-[4px]">
            {event.artists?.length > 0
              ? event.artists.map((artist) => (
                <div
                  key={artist.id}
                  className="px-[6px] py-[2px] bg-[#F86852] text-text-1 w-auto typo-label3 rounded-[4px]"
                >
                  {artist.nameKr}
                </div>
              ))
              : event.artistGroups?.length > 0
                ? event.artistGroups.map((artistGroup) => (
                  <div
                    key={artistGroup.id}
                    className="px-[6px] py-[2px] bg-[#F86852] text-text-1 w-auto typo-label3 rounded-[4px]"
                  >
                    {artistGroup.nameKr}
                  </div>
                ))
                : null}
          </div>
          <div className="flex items-center gap-[8px]">
            <button onClick={handleShare}>
              <Share />
            </button>
            <button onClick={toggleBookmark}>
              {isBookmarked ? <HeartFill /> : <HeartDefault />}
            </button>
            {event.editable && (
              <div
                className="relative flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
              >
                <button>
                  <Etc />
                </button>
                {isMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-[8px] bg-white rounded-[8px] z-[9999] w-[90px] border border-divider-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="w-full text-left px-[16px] py-[8px] hover:bg-gray-100 typo-caption3 border-b border-divider-1"
                      onClick={handleEdit}
                    >
                      수정하기
                    </button>
                    <button
                      className="w-full text-left px-[16px] py-[8px] text-red-500 hover:bg-gray-100 text-[12px] font-[400]"
                      onClick={handleDeleteClick}
                    >
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <h1 className="typo-title1 text-text-5 pb-[px]">
          {event.title}
        </h1>

        <div className="flex items-center justify-start mb-[8px]">
          <Twitter />
          <p className="typo-label2 text-text-5 pl-[8px]">
            주최
          </p>
          <p className="typo-caption2 text-text-4 underline pl-[16px] pr-[4px]">
            @{event.organizer?.xHandle}
          </p>
          {event.organizer?.verified === true ? <XVerification /> : ""}
        </div>

        <div className="flex items-center justify-start mb-[8px]">
          <Calendar />
          <p className="typo-label2 text-text-5 pl-[8px]">
            기간
          </p>
          <p className="typo-caption2 text-text-4 pl-[16px]">
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </p>
        </div>

        <div className="flex items-center justify-start mb-[8px]">
          <Clock />
          <p className="typo-label2 text-text-5 pl-[8px]">
            시간
          </p>
          <p className="typo-caption2 text-text-4 pl-[16px]">
            {event.openTime} - {event.closeTime}
          </p>

          {/* 운영 상태 태그 */}
          <div className="ml-[8px] flex justify-center items-center">
            {isOpenNow(event.openTime, event.closeTime) ? (
              <span className="px-[6px] py-[2px] typo-label3 rounded-md bg-beige-200 text-red-400">
                영업 중
              </span>
            ) : (
              <span className="px-[6px] py-[2px] typo-label3 rounded-md text-text-3 bg-bg-2">
                영업 종료
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-start mb-[36px]">
          <Place />
          <p className="typo-label2 text-text-5 pl-[8px]">
            장소
          </p>
          <p className="typo-caption3 text-text-4 pl-[16px]">
            {event.place.name}
          </p>
        </div>

        {/* 지도 */}
        <div className="mb-[40px]">
          <h3 className="typo-title3 text-text-5 mb-[12px]">
            위치
          </h3>
          <KakaoMap
            address={event.place.roadAddress || event.place.jibunAddress || ""}
            lat={event.place.lat}
            lng={event.place.lon}
          />
        </div>

        {/* 기본 특전 */}
        {includedBenefits.length > 0 && (
          <div className="mb-[40px]">
            <h3 className="font-[700] text-[16px] text-text-5 mb-[12px]">
              기본 특전
            </h3>
            <div className="grid grid-cols-3 gap-[12px]">
              {includedBenefits.map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-center items-center min-h-[52px] border border-divider-1 rounded-[4px] p-[12px]"
                >
                  <p className="text-[12px] font-[600] text-text-5">
                    {b.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 선착 특전 */}
        {limitedBenefits.length > 0 && (
          <div className="mb-[40px]">
            <h3 className="font-[700] text-[16px] text-text-5 mb-[12px]">
              선착 특전
            </h3>
            <div className="grid grid-cols-3 gap-[12px]">
              {limitedBenefits.map((b, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-center items-center min-h-[52px] border border-divider-1 rounded-[4px] p-[12px]"
                >
                  {b.dayIndex !== undefined && (
                    <p className="text-[10px] font-[400] text-text-4 mb-[4px]">
                      {b.dayIndex}일차
                    </p>
                  )}
                  <p className="text-[12px] font-[600] text-text-5">
                    {b.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 공지사항 */}
        <NoticeList notices={event.notices} eventId={event.id} />
      </div>
    </div>
  );
}
