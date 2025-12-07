"use client";

import { useEffect, useState } from "react";
import Backward from "@/svgs/Backward.svg";
import RegisterEventListCard, {
  RegisterEventListCardProps,
} from "./components/RegisterEventListCard";
import { getMyRegisterEvent } from "@/apis/api";
import { EventState } from "@/app/search/page";
import Topbar from "@/components/template/Topbar";
import { useRouter } from "next/navigation";

export interface MyRegisteredEvent {
  id: string;
  title: string;
  images: {
    id: string;
    variants: {
      name: string;
      url: string;
    }[];
  }[];
  artistNamesKr: string[];
  openTime: string;
  closeTime: string;
  startDate: string;
  endDate: string;
  bookmarkCount: string;
  bookmarked: boolean;
}

const MyRegisteredEvents = () => {
  const [events, setEvents] = useState<RegisterEventListCardProps[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  // const [filterState, setFilterState] = useState<EventState>("LATEST");

  const router = useRouter();
  const handleBackRouter = () => router.back();

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      // events 상태도 업데이트
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id
            ? { ...event, bookmarked: updated.includes(id) }
            : event
        )
      );

      return updated;
    });
  };

  const fetchData = async () => {
    try {
      const res = await getMyRegisterEvent();
      const list = res?.content || [];

      const mapped: RegisterEventListCardProps[] = list.map(
        (item: MyRegisteredEvent) => ({
          id: item.id,
          title: item.title,
          imageUrl: item.images?.[0]?.variants?.[0]?.url || null,
          startDate: item.startDate,
          endDate: item.endDate,
          bookmarkCount: item.bookmarkCount,
          bookmarked: item.bookmarked,
          artistNamesKr: item.artistNamesKr?.[0],
        })
      );

      const initialLiked = mapped
        .filter((event) => event.bookmarked)
        .map((event) => event.id);

      setLikedIds(initialLiked);

      // likedIds 반영된 상태로 이벤트 저장
      setEvents(
        mapped.map((event) => ({
          ...event,
          bookmarked: initialLiked.includes(event.id),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Topbar
        _leftImage={<Backward onClick={handleBackRouter} />}
        _topNode="내가 등록한 이벤트"
      />

      <div className="flex flex-col w-full justify-center pt-[16px] px-[24px]">
        <div className="flex justify-between items-center mb-[16px]">
          <div className="flex items-center gap-[6px]">
            <h1 className="text-[14px] font-[600] text-text-5">
              등록한 이벤트
            </h1>
            <span className="text-text-3 font-[600]">{events.length}</span>
          </div>

          {/* <div className="relative">
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
          </div> */}
        </div>

        <div className="grid grid-cols-2 gap-[16px] pb-[20px] w-full">
          {events.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
              <p className="text-[12px] text-text-3 text-center font-[400]">
                등록한 이벤트가 없습니다.
              </p>
            </div>
          ) : (
            events.map((event) => (
              <RegisterEventListCard
                key={event.id}
                {...event}
                onToggleLike={toggleLike}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyRegisteredEvents;
