"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getMain } from "@/apis/api";
import useMainStore from "../stores/useMainStore";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";

export default function Home() {
  const currentMonth = new Date().toLocaleString("ko-KR", { month: "numeric" });

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
    <main className="flex flex-col">
      <div className="font-pretendard">
        <div className="w-[375px] h-[211px] bg-bg-1" />
        {/* 당월 생일 아티스트 */}
        <h1 className="font-[700] text-text-5 text-[16px] pb-[8px]">
          {currentMonth} 생일 아티스트
        </h1>
        <div className="flex gap-[8px]">
          {birthdayArtists.map((artist) => (
            <div key={artist.id} className="flex flex-col items-center">
              <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center border-[1.5px] border-primary p-[4px] mb-[8px]">
                <div className="w-[64px] h-[64px] rounded-full overflow-hidden">
                  <Image
                    src={artist.imageUrl}
                    alt={artist.nameKo}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="font-[600] text-[12px] text-text-5">
                🎂 {artist.nameKo} 🎂
              </div>
            </div>
          ))}
        </div>

        {/* 디어위드 추천 이벤트 */}
        <h1 className="font-[700] text-text-5 text-[16px] pb-[12px]">
          <span className="text-primary">디어위드</span>
          에서
          <br />
          추천하는 이벤트-!
        </h1>
        <div className="flex gap-[12px]">
          {recommendedEvents.map((recommendEvent) => {
            const isLiked = likedIds.includes(recommendEvent.id);

            return (
              <div
                key={recommendEvent.id}
                className="flex flex-col items-center"
              >
                <div className="relative rounded-[4px] w-[180px] h-[257.143px] overflow-hidden mb-[10px]">
                  <div
                    className="absolute top-[7px] right-[7.88px] cursor-pointer"
                    onClick={() => toggleLike(recommendEvent.id)}
                  >
                    {isLiked ? <HeartFill /> : <HeartDefault />}
                  </div>

                  <Image
                    src={recommendEvent.imageUrl}
                    alt={recommendEvent.title}
                    width={64}
                    height={64}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex justify-start w-full mb-[4px]">
                  <p className="flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 w-auto h-auto items-center justify-center px-[6px] py-[2px]">
                    {recommendEvent.artistNamesKr}
                  </p>
                </div>

                <div className="flex justify-start items-start w-full h-auto">
                  <p className="text-text-5 text-[14px] font-[600] text-start leading-[20px]">
                    {recommendEvent.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* HOT한 이벤트*/}
        <h1 className="font-[700] text-text-5 text-[16px]">
          지금 가장 HOT한
          <br />
          이벤트
        </h1>
        <div className="flex gap-[12px]">
          {hotEvents.map((hotEvent) => {
            const isLiked = likedIds.includes(hotEvent.id);

            return (
              <div key={hotEvent.id} className="flex flex-col items-center">
                <div className="relative rounded-[4px] w-[180px] h-[257.143px] overflow-hidden">
                  <div
                    className="absolute top-[7px] right-[7.88px] cursor-pointer"
                    onClick={() => toggleLike(hotEvent.id)}
                  >
                    {isLiked ? <HeartFill /> : <HeartDefault />}
                  </div>

                  <Image
                    src={hotEvent.imageUrl}
                    alt={hotEvent.title}
                    width={64}
                    height={64}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex justify-start items-left w-full">
                  <p className="flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 w-auto h-[20px] items-center justify-center p-[6px]">
                    {hotEvent.artistNamesKr}
                  </p>
                </div>

                <div className="flex justify-start items-left w-full h-auto">
                  <p className="text-text-5 text-[14px] font-[600] text-start">
                    {hotEvent.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 새로 등록된 이벤트*/}
        <h1 className="font-[700] text-text-5 text-[16px]">
          새로 등록된
          <br />
          이벤트
        </h1>
        <div className="flex gap-[12px]">
          {newEvents.map((newEvent) => {
            const isLiked = likedIds.includes(newEvent.id);

            return (
              <div key={newEvent.id} className="flex flex-col items-center">
                <div className="relative rounded-[4px] w-[180px] h-[257.143px] overflow-hidden">
                  <div
                    className="absolute top-[7px] right-[7.88px] cursor-pointer"
                    onClick={() => toggleLike(newEvent.id)}
                  >
                    {isLiked ? <HeartFill /> : <HeartDefault />}
                  </div>

                  <Image
                    src={newEvent.imageUrl}
                    alt={newEvent.title}
                    width={64}
                    height={64}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex justify-start items-left w-full">
                  <p className="flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 w-auto h-[20px] items-center justify-center p-[6px]">
                    {newEvent.artistNamesKr}
                  </p>
                </div>

                <div className="flex justify-start items-left w-full h-auto">
                  <p className="text-text-5 text-[14px] font-[600] text-start">
                    {newEvent.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 리뷰 */}
      </div>
    </main>
  );
}
