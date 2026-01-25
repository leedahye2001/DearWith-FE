"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  deleteEventLike,
  getEventBookmark,
  postEventLike,
} from "@/apis/api";
import DownSmall from "@/svgs/DownSmall.svg";
import EventListCard, { PhotoImage } from "../components/EventListCard";

export interface EventBookmarkProps {
  id: string;
  title: string;
  images: PhotoImage[];
  artistNamesKr: string[];
  groupNamesKr: string[];
  startDate: string;
  endDate: string;
  bookmarkCount: string;
  bookmarked: boolean;
  eventState?: EventState;
}

type EventState = "SCHEDULED" | "IN_PROGRESS" | "ENDED";

export default function EventBookmarkPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventBookmarkProps[]>([]);
  const [likedEventsIds, setLikedEventsIds] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<EventState>("IN_PROGRESS");

  const toggleEventLike = async (id: string) => {
    const isLiked = likedEventsIds.includes(id);

    try {
      if (isLiked) {
        await deleteEventLike(id);
        setLikedEventsIds((prev) => prev.filter((item) => item !== id));
      } else {
        await postEventLike(id);
        setLikedEventsIds((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error(error);
      // const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      // const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail;
      // openAlert(errorMessage);
    }
  };

  const fetchBookmarkedEvents = useCallback(async () => {
    try {
      const res: EventBookmarkProps[] = await getEventBookmark(filterState);
      const now = new Date();

      const filtered = res
        .filter((e) => {
          const start = new Date(e.startDate);
          const end = new Date(e.endDate);

          if (filterState === "IN_PROGRESS") return start <= now && end >= now;
          if (filterState === "SCHEDULED") return start > now;
          if (filterState === "ENDED") return end < now;
          return true;
        })
        .map((e) => {
          const start = new Date(e.startDate);
          const end = new Date(e.endDate);
          let eventState: EventState = "IN_PROGRESS";
          if (start > now) eventState = "SCHEDULED";
          else if (end < now) eventState = "ENDED";

          return {
            ...e,
            startDate: e.startDate.replace(/-/g, "."),
            endDate: e.endDate.replace(/-/g, "."),
            eventState,
          };
        });

      setEvents(filtered);
      setLikedEventsIds(filtered.filter((e) => e.bookmarked).map((e) => e.id));
      return filtered;
    } catch (error) {
      console.error("북마크 이벤트 조회 실패:", error);
    }
  }, [filterState]);

  useEffect(() => {
    fetchBookmarkedEvents();
  }, [fetchBookmarkedEvents]);

  return (
    <div className="flex flex-col w-full justify-center pt-[16px]">
      {/* Category Tabs */}
      <div className="flex w-full mt-[12px] border-b border-divider-1">
        <button
          className="flex-1 py-[8px] text-center typo-label2 border-b-[2px] border-primary text-text-5"
          onClick={() => router.push("/event-bookmark/event")}
        >
          이벤트
        </button>
        <button
          className="flex-1 py-[8px] text-center typo-label2 text-text-3"
          onClick={() => router.push("/event-bookmark/artist")}
        >
          아티스트
        </button>
      </div>
      <div className="px-[24px]">
        <div className="flex justify-between items-center my-[16px]">
          <h1 className="typo-label2 text-text-5">
            찜한 이벤트
            <span className="text-text-3 ml-1">{events.length}</span>
          </h1>

          <div className="relative">
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value as EventState)}
              className="appearance-none border border-primary text-primary typo-label3 rounded-[4px] bg-white h-[24px] px-[10px] pr-[28px]"
            >
              <option value="SCHEDULED">진행 예정</option>
              <option value="IN_PROGRESS">진행 중</option>
              <option value="ENDED">진행 종료</option>
            </select>
            <DownSmall className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="w-full pb-[20px] grid grid-cols-2 gap-[16px]">
          {events.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
              <p className="typo-label1 text-text-5">
                아직 찜한 이벤트가 없어요.
              </p>
              <p className="typo-caption3 text-text-3">
                마음에 드는 항목을 찜해보세요!
              </p>
            </div>
          ) : (
            events.map((event) => (
              <EventListCard
                key={`event-${event.id}`}
                {...event}
                bookmarked={likedEventsIds.includes(event.id)}
                onToggleLike={() => toggleEventLike(event.id)}
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
}
