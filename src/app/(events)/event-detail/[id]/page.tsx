"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Share from "@/svgs/Share.svg";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";
import Twitter from "@/svgs/Twitter.svg";
import Clock from "@/svgs/Clock.svg";
import Place from "@/svgs/Place.svg";
import Calendar from "@/svgs/Calendar.svg";
import KakaoMap from "../components/KakaoMap";
import Image from "next/image";
import {
  deleteEventLike,
  getEventDetail,
  // getEventNoticeList,
  postEventLike,
} from "@/apis/api";
import EventReview from "../components/EventReview";
import NoticeList from "../components/NoticeList";
import Spinner from "@/components/Spinner/Spinner";

interface EventDetail {
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
    kakaoPlaceId: string;
    lon: number;
    lat: number;
  };
  images: {
    id: number;
    imageUrl: string;
    displayOrder: number;
  }[];
  artists: {
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
  };
  bookmarked: boolean;
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
  const handleBackRouter = () => router.back();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [event, setEvent] = useState<EventDetail | null>(null);
  // const [notice, setNotice] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"home" | "review">("home");
  const [isBookmarked, setIsBookmarked] = useState(false);

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
    } catch (err) {
      console.error(err);
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
      } catch (err) {
        console.error(err);
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

  const isOpenNow = (openTime: string, closeTime: string) => {
    // 둘 다 null이면 기본값
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

  if (isLoading) return <Spinner />;

  if (!event)
    return (
      <div className="flex justify-center items-center h-screen text-text-5">
        이벤트 정보를 찾을 수 없습니다.
      </div>
    );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${String(date.getFullYear()).slice(2)}.${String(
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
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar
        _leftImage={
          <button onClick={handleBackRouter}>
            <Backward onClick={handleBackRouter} />
          </button>
        }
        _topNode={event.title}
        _rightImage={<Share />}
      />

      {/* 탭 */}
      <div className="flex justify-around border-b border-divider-1 mt-[4px]">
        <button
          onClick={() => setActiveTab("home")}
          className={`w-1/2 py-[12px] text-[14px] font-[600] ${
            activeTab === "home"
              ? "text-primary border-b-[2px] border-primary"
              : "text-text-3"
          }`}
        >
          홈
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`w-1/2 py-[12px] text-[14px] font-[600] ${
            activeTab === "review"
              ? "text-primary border-b-[2px] border-primary"
              : "text-text-3"
          }`}
        >
          리뷰
        </button>
      </div>

      {/* 👇 탭에 따른 내용 */}
      {activeTab === "home" ? (
        <>
          {/* 이벤트 대표 이미지 */}
          {event.images?.length > 0 && (
            <div className="relative w-full h-[536px]">
              <Image
                src={event.images[0].imageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-[24px]">
            <div className="flex justify-between items-center pb-[8px] pt-[28px]">
              <div className="flex gap-[4px]">
                {event.artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="px-[6px] py-[2px] bg-[#F86852] text-text-1 w-auto text-[12px] font-[600] rounded-[4px]"
                  >
                    {artist.nameKr}
                  </div>
                ))}
              </div>
              <button onClick={toggleBookmark}>
                {isBookmarked ? <HeartFill /> : <HeartDefault />}
              </button>
            </div>

            <h1 className="font-[700] text-[24px] text-text-5 pb-[16px]">
              {event.title}
            </h1>

            <div className="flex items-center justify-start mb-[4px]">
              <Twitter />
              <p className="font-[600] text-[14px] text-text-5 pl-[8px]">
                주최
              </p>
              <p className="font-[400] text-[12px] text-text-4 underline pl-[16px]">
                @{event.organizer?.xHandle}
              </p>
            </div>

            <div className="flex items-center justify-start mb-[4px]">
              <Calendar />
              <p className="font-[600] text-[14px] text-text-5 pl-[8px]">
                기간
              </p>
              <p className="font-[400] text-[12px] text-text-4 pl-[16px]">
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </p>
            </div>

            <div className="flex items-center justify-start mb-[4px]">
              <Clock />
              <p className="font-[600] text-[14px] text-text-5 pl-[8px]">
                시간
              </p>
              <p className="font-[400] text-[12px] text-text-4 pl-[16px]">
                {event.openTime} - {event.closeTime}
              </p>

              {/* 운영 상태 태그 */}
              <div className="ml-[8px] flex justify-center items-center">
                {isOpenNow(event.openTime, event.closeTime) ? (
                  <span className="px-[6px] py-[2px] text-[12px] rounded-md bg-beige-200 text-red-400 font-semibold">
                    영업 중
                  </span>
                ) : (
                  <span className="px-[6px] py-[2px] text-[12px] rounded-md bg-bg-2 text-text-3 font-semibold">
                    영업 종료
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-start mb-[36px]">
              <Place />
              <p className="font-[600] text-[14px] text-text-5 pl-[8px]">
                장소
              </p>
              <p className="font-[400] text-[12px] text-text-4 pl-[16px]">
                {event.place.name}
              </p>
            </div>

            {/* 지도 */}
            <div className="mb-[40px]">
              <h3 className="font-[700] text-[16px] text-text-5 mb-[12px]">
                위치
              </h3>
              <KakaoMap
                address={event.place.roadAddress}
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
                          {b.dayIndex + 1}일차
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
        </>
      ) : (
        <EventReview eventId={event.id} />
      )}
    </div>
  );
}
