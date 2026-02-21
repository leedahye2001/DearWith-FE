"use client";

import { useEffect, useState, useCallback } from "react";
import { getHotArtistGroupTopTwenty, getMain } from "@/apis/api";
import useMainStore from "../stores/useMainStore";
import EventSection from "./components/EventSection";
import Topbar from "@/components/template/Topbar";
import DearwithLogo from "@/svgs/DearwithLogo.svg";
import { Carousel } from "@/components/Carousel/Carousel";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import InfiniteRolling from "@/components/InfiniteRolling.tsx/InfiniteRolling";
import BellNotification from "./components/BellNotification";
import MainSkeleton from "./components/MainSkeleton";
import Image from "next/image";
import { AxiosError } from "axios";
import useModalStore from "../stores/useModalStore";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import RefreshIcon from "@/components/Icons/RefreshIcon";

interface hotArtistGroup {
  id: string;
  imageUrl: string;
  nameKr: string;
  type: string;
}

export default function Home() {
  const router = useRouter();

  const { openAlert } = useModalStore();
  const setMainData = useMainStore((state) => state.setMainData);
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const recommendedEvents = useMainStore((state) => state.recommendedEvents);
  const hotEvents = useMainStore((state) => state.hotEvents);
  const newEvents = useMainStore((state) => state.newEvents);
  const latestReviews = useMainStore((state) => state.latestReviews);
  const [hotData, setHotData] = useState<hotArtistGroup[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toggleLike = (id: string) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const fetchData = useCallback(async () => {
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
      setIsLoading(false);
    } catch (error) {

      console.error(error);
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "데이터 로딩에 실패했습니다. 다시 시도해주세요.";
      openAlert(errorMessage);
    }
  }, [setMainData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { rootRef, pullOffset, isPulling, isRefreshing, showRefreshIndicator } = usePullToRefresh(fetchData);

  const handleRouter = (url: string) => {
    router.push(url);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col w-full justify-center">
        <Topbar
          _leftImage={<DearwithLogo />}
          _rightImage={
            <BellNotification onClick={() => router.push("/notification")} />
          }
        />
        <MainSkeleton />
      </div>
    );
  }

  return (
    <div ref={rootRef} className="flex flex-col w-full justify-center">
      <Topbar
        _leftImage={<DearwithLogo />}
        _rightImage={
          <BellNotification onClick={() => router.push("/notification")} />
        }
      />

      {showRefreshIndicator && (
        <div
          className="flex justify-center items-center w-full py-[20px] bg-bg-1 shrink-0"
          aria-live="polite"
          aria-busy={isRefreshing}
        >
          <RefreshIcon isRefreshing={isRefreshing} />
        </div>
      )}

      <div
        className="min-h-0 flex-1"
        style={{
          transform: pullOffset > 0 ? `translateY(${pullOffset}px)` : undefined,
          transition: isPulling ? "none" : "transform 0.25s ease-out",
        }}
      >
      {/* 캐러셀 */}
      {bannerImages.length > 0 && (
        <Carousel modalCarouselImageJson={{ images: bannerImages }} />
      )}

      {/* 당월 생일 아티스트 */}
      {/* <BirthdayArtistsSection
        currentMonth={currentMonth}
        birthdayArtists={birthdayArtists}
      /> */}

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
        <h1 className="typo-title3 text-text-5 pb-[12px] pl-[24px]">
          회원님들의
          <br />찐 리뷰
        </h1>

        <div className="flex flex-col gap-[8px] px-[24px] mb-[40px] ">
          {latestReviews?.length > 0 ? (
            latestReviews.map((review) => (
              <div
                key={review.reviewId}
                className="flex justify-start items-start border border-divider-1 rounded-[4px] p-[12px] min-w-[260px] gap-[10px] cursor-pointer"
                onClick={() =>
                  router.push(
                    `/event-detail/${review.eventId}/review?highlight=${review.reviewId}`
                  )
                }
              >
                <div className="relative w-[40px] h-[40px] overflow-hidden rounded-[4px] shrink-0">
                  {review.images?.[0]?.variants?.[0]?.url || review.images?.[0]?.variants?.[1]?.url ? (
                    <Image
                      src={review.images?.[0]?.variants?.[0]?.url || review.images?.[0]?.variants?.[1]?.url}
                      alt={review.title}
                      fill
                      sizes="40px"
                      className="object-cover !w-full !h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-[10px] text-text-3">
                      No Img
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <p className="typo-label2 text-text-5 ">
                    {review.title}
                  </p>
                  <span className="typo-caption4 text-text-4 block w-[200px] truncate">
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
      <h1 className="typo-title3 text-text-5 text-center">
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
    </div>
  );
}
