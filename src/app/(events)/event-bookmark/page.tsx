"use client";

import { useEffect, useState } from "react";
import { getEventBookmark } from "@/apis/api";
import DownSmall from "@/svgs/DownSmall.svg";
import EventListCard from "./components/EventListCard";

export interface Event {
  id: number;
  title: string;
  imageUrl: string | null;
  artistNamesEn: string[];
  artistNamesKr: string[];
  startDate: string;
  endDate: string;
  bookmarkCount: number;
  bookmarked: boolean;
}

type EventState = "SCHEDULED" | "IN_PROGRESS" | "ENDED";

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [filterState, setFilterState] = useState<EventState>("IN_PROGRESS");

  const toggleLike = (id: number) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const fetchBookmarkedEvents = async () => {
    try {
      const eventsArray: Event[] = await getEventBookmark(filterState);

      const now = new Date();

      const filtered = eventsArray
        .filter((e) => {
          const start = new Date(e.startDate);
          const end = new Date(e.endDate);

          if (filterState === "IN_PROGRESS") return start <= now && end >= now;
          if (filterState === "SCHEDULED") return start > now;
          if (filterState === "ENDED") return end < now;
          return true;
        })
        .map((event) => ({
          ...event,
          startDate: event.startDate.replace(/-/g, "."),
          endDate: event.endDate.replace(/-/g, "."),
        }));

      setEvents(filtered);

      const bookmarkedIds = filtered
        .filter((e) => e.bookmarked)
        .map((e) => e.id);
      setLikedIds(bookmarkedIds);
    } catch (error) {
      console.error("북마크 이벤트 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchBookmarkedEvents();
  }, [filterState]);

  return (
    <div className="flex flex-col w-full justify-center pt-[16px] px-[24px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[16px] gap-2">
        <h1 className="text-[14px] font-[600] text-text-5">
          찜한 이벤트 <span className="text-text-3">{events.length}</span>
        </h1>

        {/* Custom Dropdown */}
        <div className="relative">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as EventState)}
            className="appearance-none border border-[1px] border-primary text-primary text-[12px] font-[600] rounded-[4px] bg-white text-text-5 h-[24px] px-[10px] pr-[28px]"
          >
            <option value="SCHEDULED">진행 예정</option>
            <option value="IN_PROGRESS">진행 중</option>
            <option value="ENDED">진행 종료</option>
          </select>
          <DownSmall className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none w-[14px] h-[14px]" />
        </div>
      </div>

      {/* Event Grid (2 Columns) */}
      <div className="grid grid-cols-2 gap-[16px] pb-[20px] w-full">
        {events.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
            <p className="text-[16px] text-text-5 text-center font-[600]">
              아직 찜한 이벤트가 없어요.
            </p>
            <p className="text-[12px] text-text-3 text-center font-[400]">
              마음에 드는 이벤트를 찜해주세요!
            </p>
          </div>
        ) : (
          events.map((event) => {
            const start = new Date(event.startDate.replace(/\./g, "-"));
            const end = new Date(event.endDate.replace(/\./g, "-"));
            const now = new Date();

            const eventState: EventState =
              start > now ? "SCHEDULED" : end < now ? "ENDED" : "IN_PROGRESS";

            return (
              <EventListCard
                key={event.id}
                id={event.id}
                imageUrl={event.imageUrl || "/images/carousel/생카1.png"}
                title={event.title}
                artistNamesKr={event.artistNamesKr}
                isLiked={likedIds.includes(event.id)}
                onToggleLike={toggleLike}
                eventState={eventState}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
