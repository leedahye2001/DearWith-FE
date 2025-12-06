"use client";

import { useEffect, useState } from "react";
import { getHotArtistGroupTopTwenty, getMain } from "@/apis/api";
import useMainStore from "../stores/useMainStore";
import BirthdayArtistsSection from "./components/BirthdayArtistSection";
import EventSection from "./components/EventSection";
import Topbar from "@/components/template/Topbar";
import DearwithLogo from "@/svgs/DearwithLogo.svg";
import { Carousel } from "@/components/Carousel/Carousel";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import InfiniteRolling from "@/components/InfiniteRolling.tsx/InfiniteRolling";
import BellNotification from "./components/BellNotification";
import Image from "next/image";

interface hotArtistGroup {
  id: string;
  imageUrl: string;
  nameKr: string;
  type: string;
}

export default function Home() {
  const router = useRouter();
  const currentMonth = new Date().toLocaleString("ko-KR", { month: "numeric" });

  const setMainData = useMainStore((state) => state.setMainData);
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const birthdayArtists = useMainStore((state) => state.birthdayArtists);
  const recommendedEvents = useMainStore((state) => state.recommendedEvents);
  const hotEvents = useMainStore((state) => state.hotEvents);
  const newEvents = useMainStore((state) => state.newEvents);
  const latestReviews = useMainStore((state) => state.latestReviews);
  const [hotData, setHotData] = useState<hotArtistGroup[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getMain();
      const hotArtistGroupData = await getHotArtistGroupTopTwenty();

      setMainData({
        birthdayArtists: data.birthdayArtists,
        recommendedEvents: data.recommendedEvents,
        hotEvents: data.hotEvents,
        newEvents: data.newEvents,
        latestReviews: data.latestReviews,
      });
      setHotData(hotArtistGroupData);
      // banner 이미지 추출
      const bannerUrls =
        data.banners?.map(
          (b: { id: string; imageUrl: string }) => b.imageUrl
        ) || [];
      setBannerImages(bannerUrls);

      const allEvents = [
        ...data.recommendedEvents,
        ...data.hotEvents,
        ...data.newEvents,
      ];

      const initialLiked = allEvents
        .filter((event) => event.bookmarked)
        .map((event) => event.id);

      setLikedIds(initialLiked);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleRouter = (url: string) => {
    router.push(url);
  };

  return (
    <div className="flex flex-col w-full justify-center">
      <Topbar
        _leftImage={<DearwithLogo />}
        _rightImage={
          <BellNotification onClick={() => router.push("/notification")} />
        }
      />

      {/* 캐러셀 */}
      {bannerImages.length > 0 && (
        <Carousel modalCarouselImageJson={{ images: bannerImages }} />
      )}

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
      <div>
        <h1 className="font-[700] text-text-5 text-[16px] pb-[12px] pl-[24px]">
          회원님들의
          <br />찐 리뷰
        </h1>

        <div className="flex flex-col gap-[8px] px-[24px] mb-[40px] ">
          {latestReviews?.length > 0 ? (
            latestReviews.map((review) => (
              <div
                key={review.reviewId}
                className="flex justify-start items-start border border-divider-1 rounded-[4px] p-[12px] min-w-[260px] gap-[10px] cursor-pointer"
                onClick={() => router.push(`/review/${review.reviewId}`)}
              >
                <div className="w-[40px] h-[40px] rounded-[4px] overflow-hidden">
                  <Image
                    src={review.images?.[0]?.variants?.[0]?.url}
                    alt={review.title}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="text-[14px] font-[500] text-text-5 ">
                    {review.title}
                  </p>
                  <span className="text-[10px] text-text-4 block w-[200px] truncate">
                    {review.content}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <span className="text-text-4 text-sm">등록된 리뷰가 없습니다.</span>
          )}
        </div>
      </div>

      {/* HOT 아티스트 그룹 리스트 */}
      <h1 className="font-[700] text-text-5 text-[16px] text-center">
        디어위드에서
        <br />
        새로 보고 싶은 콘텐츠가 있다면?
      </h1>
      <InfiniteRolling items={hotData ?? []} />

      {/* 아티스트 등록, 이벤트 등록 */}
      <div className="flex justify-between w-full px-[24px] gap-[11px] mb-[60px]">
        <Button
          _state="main"
          _node="아티스트 등록"
          _onClick={() => handleRouter(`/artist-register`)}
        />
        <Button
          _state="main"
          _node="이벤트 등록"
          _onClick={() => handleRouter(`/event-register`)}
        />
      </div>
    </div>
  );
}
