"use client";

import { useRouter, useSearchParams } from "next/navigation";
import EventSearchResult from "../components/EventSearchResult";
import { getArtistEvents, postEventLike, deleteEventLike } from "@/apis/api";
import { useEffect, useState } from "react";
import { EventCardProps } from "@/app/main/components/MainEventCard";
import { EventState } from "../page";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleBackRouter = () => router.back();

  const artistId = searchParams?.get("artistId") ?? "";
  const artistName = searchParams?.get("artistName") ?? "";

  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [filterState, setFilterState] = useState<EventState>("LATEST");

  // ❤️ 좋아요된 이벤트 ID 리스트
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const toggleLike = async (id: number) => {
    const isLiked = likedIds.includes(id);

    // 1️⃣ UI 즉시 반영
    setLikedIds((prev) =>
      isLiked ? prev.filter((v) => v !== id) : [...prev, id]
    );
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isLiked: !isLiked } : e))
    );

    // 2️⃣ API 호출
    try {
      if (!isLiked) {
        await postEventLike(String(id));
      } else {
        await deleteEventLike(String(id));
      }
    } catch (err) {
      console.error("좋아요 토글 실패:", err);
      // 실패하면 UI 원복
      setLikedIds((prev) =>
        isLiked ? [...prev, id] : prev.filter((v) => v !== id)
      );
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isLiked: isLiked } : e))
      );
    }
  };

  const fetchEvents = async () => {
    if (!artistId) return;

    try {
      const res = await getArtistEvents(artistId, filterState);
      const eventList = res?.page?.content;

      if (!Array.isArray(eventList)) {
        console.error("getArtistEvents 응답에 content 배열이 없음:", res);
        setEvents([]);
        return;
      }

      // 서버 bookmarked 기반 likedIds 초기화
      const bookmarkedIds = eventList
        .filter((e) => e.bookmarked)
        .map((e) => e.id);

      setLikedIds(bookmarkedIds);

      // 이벤트 리스트 변환
      const convertedEvents = eventList.map((e) => ({
        ...e,
        isLiked: bookmarkedIds.includes(e.id),
        onToggleLike: toggleLike,
      }));

      setEvents(convertedEvents);
    } catch (err) {
      console.error("이벤트 조회 실패:", err);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [artistId, filterState]);

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar
        _leftImage={<Backward onClick={handleBackRouter} />}
        _topNode={artistName}
      />

      <EventSearchResult
        key={artistId}
        events={events.slice(0, 10)}
        filterState={filterState}
        setFilterState={setFilterState}
        artistName={artistName}
      />
    </div>
  );
};

export default Page;
