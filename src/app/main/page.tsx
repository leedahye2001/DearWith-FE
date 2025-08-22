"use client";

import { useEffect, useState } from "react";
import { getMain } from "@/apis/api";
import useMainStore from "../stores/useMainStore";
import BirthdayArtistsSection from "./components/BirthdayArtistSection";
import EventSection from "./components/EventSection";
import Topbar from "@/components/template/Topbar";
import DearwithLogo from "@/svgs/DearwithLogo.svg";
import BellDefault from "@/svgs/BellDefault.svg";
// import useUserStore from "@/app/stores/userStore";

export default function Home() {
  const currentMonth = new Date().toLocaleString("ko-KR", { month: "numeric" });

  // const nickname = useUserStore((state) => state.nickname);
  const setMainData = useMainStore((state) => state.setMainData);
  const birthdayArtists = useMainStore((state) => state.birthdayArtists);
  const recommendedEvents = useMainStore((state) => state.recommendedEvents);
  const hotEvents = useMainStore((state) => state.hotEvents);
  const newEvents = useMainStore((state) => state.newEvents);

  const [likedIds, setLikedIds] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const fetchData = async () => {
    try {
      const data = await getMain();
      setMainData({
        birthdayArtists: data.birthdayArtists,
        recommendedEvents: data.recommendedEvents,
        hotEvents: data.hotEvents,
        newEvents: data.newEvents,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full justify-center">
      <Topbar _leftImage={<DearwithLogo />} _rightImage={<BellDefault />} />
      {/* 배너 */}
      <div className="w-full h-[211px] bg-primary mb-[24px]" />

      {/* 닉네임 테스트 용 */}
      {/* <div className="px-6 py-4 text-lg font-bold text-text-5">
        안녕하세요, {nickname ? nickname : "???"} 님 👋
      </div> */}

      {/* 당월 생일 아티스트 */}
      <BirthdayArtistsSection
        currentMonth={currentMonth}
        birthdayArtists={birthdayArtists}
      />

      <EventSection
        title={
          <>
            <span className="text-primary">디어위드</span>
            에서 <br />
            추천하는 이벤트-!
          </>
        }
        events={recommendedEvents}
        likedIds={likedIds}
        onToggleLike={toggleLike}
      />
      <EventSection
        title={
          <>
            지금 가장 HOT한
            <br /> 이벤트
          </>
        }
        events={hotEvents}
        likedIds={likedIds}
        onToggleLike={toggleLike}
      />
      <EventSection
        title={
          <>
            새로 등록된
            <br />
            이벤트
          </>
        }
        events={newEvents}
        likedIds={likedIds}
        onToggleLike={toggleLike}
      />

      {/* 리뷰 */}
    </div>
  );
}
