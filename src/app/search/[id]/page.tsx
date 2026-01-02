"use client";

import { useRouter, useSearchParams } from "next/navigation";
import EventSearchResult from "../components/EventSearchResult";
import {
  getArtistEvents,
  getGroupEvents,
  postEventLike,
  deleteEventLike,
  postArtistLike,
  deleteArtistLike,
  getArtistBookmark,
} from "@/apis/api";
import { useEffect, useState, useCallback } from "react";
import { EventCardProps } from "@/app/main/components/MainEventCard";
import { EventState } from "../page";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";

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
  const [isArtistBookmarked, setIsArtistBookmarked] = useState(false);

  const fetchEvents = useCallback(async () => {
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

      // toggleLike를 직접 참조하지 않고 함수로 전달
      const handleToggleLike = async (eventId: string) => {
        setEvents((prevEvents) => {
          const currentEvent = prevEvents.find((e) => e.id === eventId);
          const isLiked = currentEvent?.isLiked ?? currentEvent?.bookmarked ?? false;
          
          const updatedEvents = prevEvents.map((e) => 
            e.id === eventId ? { ...e, isLiked: !isLiked } : e
          );

          (async () => {
            try {
              if (isLiked) await deleteEventLike(eventId);
              else await postEventLike(eventId);
            } catch (err) {
              console.error("좋아요 토글 실패:", err);
              setEvents((prevEvents) =>
                prevEvents.map((e) => (e.id === eventId ? { ...e, isLiked } : e))
              );
            }
          })();

          return updatedEvents;
        });
      };

      setEvents(
        eventList.map((e) => ({
          ...e,
          isLiked: bookmarkedIds.includes(e.id),
          onToggleLike: handleToggleLike,
        }))
      );
    } catch (err) {
      console.error("이벤트 조회 실패:", err);
      setEvents([]);
    }
  }, [type, artistId, groupId, filterState]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 아티스트 찜 상태 확인
  useEffect(() => {
    const fetchArtistBookmarkStatus = async () => {
      if (type === "ARTIST" && artistId) {
        try {
          const bookmarkedArtists = await getArtistBookmark();
          const isBookmarked = bookmarkedArtists?.some(
            (artist: { id: number | string }) => String(artist.id) === String(artistId)
          );
          setIsArtistBookmarked(isBookmarked || false);
        } catch (err) {
          console.error("아티스트 찜 상태 확인 실패:", err);
        }
      }
    };

    fetchArtistBookmarkStatus();
  }, [type, artistId]);

  // 아티스트 찜 토글
  const toggleArtistBookmark = async () => {
    if (type !== "ARTIST" || !artistId) return;

    const prevState = isArtistBookmarked;
    setIsArtistBookmarked(!prevState);

    try {
      if (prevState) {
        await deleteArtistLike(artistId);
      } else {
        await postArtistLike(artistId);
      }
    } catch (err) {
      console.error("아티스트 찜 토글 실패:", err);
      setIsArtistBookmarked(prevState); // 실패 시 롤백
    }
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar
        _leftImage={<Backward onClick={() => router.back()} />}
        _topNode={title}
        _rightImage={
          type === "ARTIST" && artistId ? (
            <button onClick={toggleArtistBookmark}>
              {isArtistBookmarked ? <HeartFill /> : <HeartDefault />}
            </button>
          ) : undefined
        }
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
