"use client";

import { useEffect, useState } from "react";
import DownSmall from "@/svgs/DownSmall.svg";
import EventListCard, {
  EventListCardProps,
} from "@/app/(events)/event-bookmark/components/EventListCard";
import { getMyRegisterArtist } from "@/apis/api";
import { EventState } from "@/app/search/page";
import Topbar from "@/components/template/Topbar";
export interface MyRegisteredEvent {
  id: number;
  title: string;
  images: {
    id: number;
    variants: {
      name: string;
      url: string;
    }[];
  }[];
  artistNamesEn: string[];
  artistNamesKr: string[];
  groupNamesEn: string[];
  groupNamesKr: string[];
  openTime: string;
  closeTime: string;
  startDate: string;
  endDate: string;
  bookmarkCount: number;
  bookmarked: boolean;
}

export interface MappedEventItem {
  id: number;
  title: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  bookmarkCount: number;
  bookmarked: boolean;
  artistName?: string;
  groupName?: string;
}

const MyRegisteredEvents = () => {
  const [events, setEvents] = useState<EventListCardProps[]>([]);
  const [filterState, setFilterState] = useState<EventState>("LATEST");

  const fetchData = async () => {
    try {
      const res = await getMyRegisterArtist(); // ← API 콜
      const list = res?.content || [];

      const mapped: EventListCardProps[] = list.map(
        (item: MyRegisteredEvent) => ({
          id: item.id,
          title: item.title,
          imageUrl: item.images?.[0]?.variants?.[0]?.url || null,
          startDate: item.startDate,
          endDate: item.endDate,
          bookmarkCount: item.bookmarkCount,
          bookmarked: item.bookmarked,
          artistName: item.artistNamesKr?.join(", "),
          groupName: item.groupNamesKr?.join(", "),
        })
      );

      setEvents(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterState]);

  return (
    <>
      {/* ■ Topbar */}
      <Topbar _topNode="내가 등록한 이벤트" />

      {/* ■ Content */}
      <div className="flex flex-col w-full justify-center pt-[16px] px-[24px]">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-[16px]">
          <h1 className="text-[14px] font-[600] text-text-5">
            등록한 이벤트{" "}
            <span className="text-primary font-[600]">{events.length}</span>
          </h1>

          {/* 정렬 셀렉트 */}
          <div className="relative">
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value as EventState)}
              className="appearance-none border border-primary text-primary text-[12px] font-[600] rounded-[4px] bg-white h-[24px] px-[10px] pr-[28px]"
            >
              <option value="LATEST">최신순</option>
              <option value="UPCOMING">예정순</option>
              <option value="POPULAR">좋아요순</option>
            </select>
            <DownSmall className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none w-[14px] h-[14px]" />
          </div>
        </div>

        {/* 리스트 */}
        <div className="grid grid-cols-2 gap-[16px] pb-[20px] w-full">
          {events.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
              <p className="text-[12px] text-text-3 text-center font-[400]">
                등록한 이벤트가 없습니다.
              </p>
            </div>
          ) : (
            events.map((event) => <EventListCard key={event.id} {...event} />)
          )}
        </div>
      </div>
    </>
  );
};

export default MyRegisteredEvents;
