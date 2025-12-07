"use client";

import { useEffect, useState } from "react";
import {
  deleteArtistLike,
  deleteEventLike,
  deleteGroupLike,
  getArtistBookmark,
  getEventBookmark,
  postArtistLike,
  postEventLike,
  postGroupLike,
} from "@/apis/api";
import DownSmall from "@/svgs/DownSmall.svg";
import EventListCard from "./components/EventListCard";
import ArtistListCard from "./components/ArtistListCard";

export interface EventBookmarkProps {
  id: string;
  title: string;
  imageUrl: string;
  artistNamesKr: string[];
  startDate: string;
  endDate: string;
  bookmarkCount: string;
  bookmarked: boolean;
}

export interface ArtistBookmarkProps {
  id: string;
  nameKr: string;
  imageUrl: string | null;
  type: ArtistType;
  createdAt: string;
  birthDate: string;
  debutDate: string;
  bookmarked: boolean;
}

type EventState = "SCHEDULED" | "IN_PROGRESS" | "ENDED";
type CategoryType = "ARTIST" | "GROUP" | "EVENT";
type ArtistType = "ARTIST" | "GROUP";

export default function Page() {
  const [events, setEvents] = useState<EventBookmarkProps[]>([]);
  const [artists, setArtists] = useState<ArtistBookmarkProps[]>([]);
  const [likedEventsIds, setLikedEventsIds] = useState<string[]>([]);
  const [likedArtistsIds, setLikedArtistsIds] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<EventState>("IN_PROGRESS");
  const [category, setCategory] = useState<CategoryType>("ARTIST");

  const toggleLike = async (id: string, type: CategoryType) => {
    if (type === "EVENT") return;

    const isLiked = likedArtistsIds.includes(id);

    try {
      if (isLiked) {
        if (type === "GROUP") await deleteGroupLike(id);
        else await deleteArtistLike(id);
        setLikedArtistsIds((prev) => prev.filter((item) => item !== id));
      } else {
        if (type === "GROUP") await postGroupLike(id);
        else await postArtistLike(id);
        setLikedArtistsIds((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error("찜 API 실패:", error);
    }
  };
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
      console.error("이벤트 찜 API 실패:", error);
    }
  };

  const fetchBookmarkedEvents = async () => {
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
        .map((e) => ({
          ...e,
          startDate: e.startDate.replace(/-/g, "."),
          endDate: e.endDate.replace(/-/g, "."),
        }));

      setEvents(filtered);
      setLikedEventsIds(filtered.filter((e) => e.bookmarked).map((e) => e.id));
      return filtered;
    } catch (error) {
      console.error("북마크 이벤트 조회 실패:", error);
    }
  };

  const fetchBookmarkedArtists = async () => {
    try {
      const res: ArtistBookmarkProps[] = await getArtistBookmark();
      setArtists(res);
      setLikedArtistsIds(res.filter((e) => e.bookmarked).map((e) => e.id));
      return res;
    } catch (error) {
      console.error("북마크 아티스트 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (category === "EVENT") fetchBookmarkedEvents();
    else fetchBookmarkedArtists();
  }, [filterState, category]);

  const count = category === "EVENT" ? events.length : artists.length;

  return (
    <div className="flex flex-col w-full justify-center pt-[16px] px-[24px]">
      {/* Category Tabs */}
      <div className="flex w-full mt-[12px] border-b border-divider-1">
        {(["ARTIST", "EVENT"] as CategoryType[]).map((type) => (
          <button
            key={type}
            className={`flex-1 py-[8px] text-center font-[600] ${
              category === type
                ? "border-b-[2px] border-primary text-text-5"
                : "text-text-3"
            }`}
            onClick={() => setCategory(type)}
          >
            {type === "ARTIST" ? "아티스트" : "이벤트"}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center my-[16px]">
        <h1 className="text-[14px] font-[600] text-text-5">
          찜한 {category === "EVENT" ? "이벤트" : "아티스트"}
          <span className="text-text-3 ml-1">{count}</span>
        </h1>

        {category === "EVENT" && (
          <div className="relative">
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value as EventState)}
              className="appearance-none border border-primary text-primary text-[12px] font-[600] rounded-[4px] bg-white h-[24px] px-[10px] pr-[28px]"
            >
              <option value="SCHEDULED">진행 예정</option>
              <option value="IN_PROGRESS">진행 중</option>
              <option value="ENDED">진행 종료</option>
            </select>
            <DownSmall className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
      </div>

      <div
        className={`w-full pb-[20px] ${
          category === "EVENT" ? "grid grid-cols-2 gap-[16px]" : "flex flex-col"
        }`}
      >
        {count === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
            <p className="text-[16px] text-text-5 font-[600]">
              아직 찜한 {category === "EVENT" ? "이벤트" : "아티스트"}가 없어요.
            </p>
            <p className="text-[12px] text-text-3">
              마음에 드는 항목을 찜해보세요!
            </p>
          </div>
        ) : category === "EVENT" ? (
          events.map((event) => (
            <EventListCard
              key={event.id}
              {...event}
              bookmarked={likedEventsIds.includes(event.id)}
              onToggleLike={() => toggleEventLike(event.id)}
            />
          ))
        ) : (
          artists.map((artist) => (
            <ArtistListCard
              key={artist.id}
              {...artist}
              bookmarked={likedArtistsIds.includes(artist.id)}
              onToggleLike={() => toggleLike(artist.id, artist.type)}
            />
          ))
        )}
      </div>
    </div>
  );
}
