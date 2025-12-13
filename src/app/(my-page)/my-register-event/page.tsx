"use client";

import { useEffect, useState } from "react";
import Backward from "@/svgs/Backward.svg";
import RegisterEventListCard, {
  RegisterEventListCardProps,
} from "./components/RegisterEventListCard";
import { getMyRegisterEvent } from "@/apis/api";
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
  const router = useRouter();

  const handleBackRouter = () => router.back();

  const toggleLike = (id: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, bookmarked: !event.bookmarked } : event
      )
    );
  };

  const fetchData = async () => {
    try {
      const res = await getMyRegisterEvent();
      const list = res?.content || [];

      const mapped: RegisterEventListCardProps[] = list.map(
        (item: MyRegisteredEvent) => ({
          id: item.id,
          title: item.title,
          imageUrl: item.images?.[2]?.variants?.[2]?.url || null,
          startDate: item.startDate,
          endDate: item.endDate,
          bookmarkCount: item.bookmarkCount,
          bookmarked: item.bookmarked,
          artistNamesKr: item.artistNamesKr?.[2],
        })
      );

      setEvents(mapped);
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
