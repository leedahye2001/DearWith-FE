"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Share from "@/svgs/Share.svg";
import HeartDefault from "@/svgs/HeartDefault.svg";
import Twitter from "@/svgs/Twitter.svg";
import Clock from "@/svgs/Clock.svg";
import Place from "@/svgs/Place.svg";
import Calendar from "@/svgs/Calendar.svg";
import KakaoMap from "../components/KakaoMap";
import Image from "next/image";
import { getEventDetail } from "@/apis/api";

interface EventDetail {
  id: number;
  title: string;
  description: string;
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
}

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const data = await getEventDetail(id);
        if (!data) throw new Error("이벤트 정보를 불러오지 못했습니다.");
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-text-5">
        로딩 중...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen text-text-5">
        이벤트 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // 날짜 포맷팅 (예: 2025-10-26 → 25.10.26)
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
        _leftImage={<Backward />}
        _topNode={event.title}
        _rightImage={<Share />}
      />

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
          <HeartDefault />
        </div>

        <h1 className="font-[700] text-[24px] text-text-5 pb-[16px]">
          {event.title}
        </h1>

        <div className="flex items-center justify-start mb-[4px]">
          <Twitter />
          <p className="font-[600] text-[14px] text-text-5 pl-[8px]">주최</p>
          <p className="font-[400] text-[12px] text-text-4 underline pl-[16px]">
            @{event.organizer?.xHandle}
          </p>
        </div>

        <div className="flex items-center justify-start mb-[4px]">
          <Calendar />
          <p className="font-[600] text-[14px] text-text-5 pl-[8px]">기간</p>
          <p className="font-[400] text-[12px] text-text-4 pl-[16px]">
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </p>
        </div>

        <div className="flex items-center justify-start mb-[4px]">
          <Clock />
          <p className="font-[600] text-[14px] text-text-5 pl-[8px]">시간</p>
          <p className="font-[400] text-[12px] text-text-4 pl-[16px]">
            {event.place.roadAddress}
          </p>
        </div>

        <div className="flex items-center justify-start mb-[36px]">
          <Place />
          <p className="font-[600] text-[14px] text-text-5 pl-[8px]">장소</p>
          <p className="font-[400] text-[12px] text-text-4 pl-[16px]">
            {event.place.name}
          </p>
        </div>

        {/* 지도 */}
        <div className="mb-[40px]">
          <h3 className="font-[700] text-[16px] text-text-5 mb-[12px]">위치</h3>
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
                  <p className="text-[12px] font-[600] text-text-5">{b.name}</p>
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
                  <p className="text-[12px] font-[600] text-text-5">{b.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between w-full items-center mb-[16px]">
            <h3 className="flex items-center font-[700] text-[16px] text-text-5">
              공지사항
            </h3>
            <p className="text-[12px] font-[400] text-text-3">더 보기</p>
          </div>

          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-col w-full justify-start items-start w-full min-h-[36px] border-divider-1 border-[0.8px] p-[12px] rounded-[4px]">
              <p className="text-[14px] font-[600] text-text-5">
                2일차 럭키드로우 운영 안내
              </p>
              <p className="text-[12px] font-[400] text-text-4">
                25.08.26 11:30
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
