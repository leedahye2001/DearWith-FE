"use client";

import { useRouter, useSearchParams } from "next/navigation";
import EventSearchResult from "../components/EventSearchResult";
import {
  getArtistEvents,
  getGroupEvents,
  postEventLike,
  deleteEventLike,
} from "@/apis/api";
import { useEffect, useState } from "react";
import { EventCardProps } from "@/app/main/components/MainEventCard";
import { EventState } from "../page";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawType = searchParams?.get("type") ?? "";

  const type = decodeURIComponent(rawType).replace(/^"+|"+$/g, "");

  const artistId = searchParams?.get("artistId") ?? "";
  const artistName = searchParams?.get("artistName") ?? "";
  const groupId = searchParams?.get("groupId") ?? "";
  const groupName = searchParams?.get("groupName") ?? "";

  const title = type === "GROUP" ? groupName : artistName;

  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [filterState, setFilterState] = useState<EventState>("LATEST");
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const toggleLike = async (id: string) => {
    const isLiked = likedIds.includes(id);

    setLikedIds((prev) =>
      isLiked ? prev.filter((v) => v !== id) : [...prev, id]
    );
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isLiked: !isLiked } : e))
    );

    try {
      if (isLiked) await deleteEventLike(id);
      else await postEventLike(id);
    } catch (err) {
      console.error("좋아요 토글 실패:", err);

      setLikedIds((prev) =>
        isLiked ? [...prev, id] : prev.filter((v) => v !== id)
      );
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isLiked } : e))
      );
    }
  };

  const fetchEvents = async () => {
    try {
      let res;

      if (type === "ARTIST" && artistId) {
        res = await getArtistEvents(artistId, filterState);
      } else if (type === "GROUP" && groupId) {
        res = await getGroupEvents(groupId, filterState);
      } else {
        console.warn("조회 조건이 부족합니다:", { type, artistId, groupId });
        setEvents([]);
        return;
      }

      const eventList = res?.page?.content ?? [];

      if (!Array.isArray(eventList)) {
        console.error("API 응답 구조 형식 오류:", res);
        setEvents([]);
        return;
      }

      const bookmarkedIds = eventList
        .filter((e) => e.bookmarked)
        .map((e) => e.id);

      setLikedIds(bookmarkedIds);

      setEvents(
        eventList.map((e) => ({
          ...e,
          isLiked: bookmarkedIds.includes(e.id),
          onToggleLike: toggleLike,
        }))
      );
    } catch (err) {
      console.error("이벤트 조회 실패:", err);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [type, artistId, groupId, filterState]);

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar
        _leftImage={<Backward onClick={() => router.back()} />}
        _topNode={title}
      />

      <EventSearchResult
        key={`${type}-${artistId || groupId}`}
        events={events.slice(0, 10)}
        filterState={filterState}
        setFilterState={setFilterState}
        artistName={title}
      />
    </div>
  );
};

export default Page;
