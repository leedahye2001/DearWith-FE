"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import { getEventDetail, getEventReviewDetail } from "@/apis/api";
import EventReviewWrite, { ReviewDetail } from "@/app/(events)/event-detail/components/EventReviewWrite";
import Spinner from "@/components/Spinner/Spinner";
import { useEffect, useState } from "react";

export default function ReviewWritePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const eventId = params?.id || "";
  const editReviewId = searchParams?.get("edit") || null;
  const [eventTitle, setEventTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviewData, setReviewData] = useState<ReviewDetail | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;
      try {
        const [eventData, reviewListData] = await Promise.all([
          getEventDetail(eventId),
          editReviewId ? getEventReviewDetail(eventId) : null,
        ]);
        
        setEventTitle(eventData.title || "");

        // 수정 모드인 경우 리뷰 데이터 로드
        if (editReviewId && reviewListData) {
          console.log("editReviewId:", editReviewId);
          console.log("reviewListData:", reviewListData);
          interface ReviewItem {
            id: number;
            content?: string;
            tags?: string[];
            images?: Array<{
              id: number;
              variants?: Array<{ url: string }>;
            }>;
          }
          interface ReviewImage {
            id: number;
            variants?: Array<{ url: string }>;
          }
          const review = reviewListData.content?.find(
            (r: ReviewItem) => String(r.id) === String(editReviewId)
          );
          console.log("found review:", review);
          if (review) {
            setReviewData({
              id: String(review.id),
              content: review.content || "",
              tags: review.tags || [],
              images: review.images?.map((img: ReviewImage, idx: number) => ({
                id: img.id,
                url: img.variants?.[2]?.url || img.variants?.[1]?.url || img.variants?.[0]?.url,
                displayOrder: idx,
              })) || [],
            });
          } else {
            console.error("리뷰를 찾을 수 없습니다. editReviewId:", editReviewId);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [eventId, editReviewId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center w-full pb-[120px]">
      <Topbar
        _leftImage={
          <button onClick={() => router.back()}>
            <Backward />
          </button>
        }
        _topNode={reviewData ? "리뷰 수정" : eventTitle || "리뷰 등록"}
      />

      <EventReviewWrite
        eventId={eventId}
        reviewData={reviewData}
        onClose={() => router.push(`/event-detail/${eventId}/review`)}
      />
    </div>
  );
}
