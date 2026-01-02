"use client";

import { useParams, useRouter } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import { getReviewDetail } from "@/apis/api";
import EventReviewWrite, { ReviewDetail } from "@/app/(events)/event-detail/components/EventReviewWrite";
import Spinner from "@/components/Spinner/Spinner";
import { useEffect, useState, Suspense } from "react";

function ReviewWriteContent() {
  const router = useRouter();
  const params = useParams<{ reviewId: string; photoId: string }>();
  const reviewId = params?.reviewId || "";
  const photoId = params?.photoId || "";
  const [isLoading, setIsLoading] = useState(true);
  const [reviewData, setReviewData] = useState<ReviewDetail | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (!reviewId || !photoId) return;
      try {
        const data = await getReviewDetail(reviewId, photoId);
        
        setReviewData({
          id: data.id,
          content: data.content || "",
          tags: data.tags || [],
          images: data.images?.map((img: { variants?: { name: string; url: string; id?: number }[] }, idx: number) => {
            const url = img.variants?.[2]?.url || img.variants?.[1]?.url || img.variants?.[0]?.url;
            return {
              id: img.variants?.[0]?.id,
              url: url || "",
              displayOrder: idx,
            };
          }) || [],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reviewId, photoId]);

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
        _topNode={reviewData ? "리뷰 수정" : "리뷰 등록"}
      />

      <EventReviewWrite
        eventId=""
        reviewData={reviewData}
        onClose={() => router.push(`/review-detail/${reviewId}/${photoId}`)}
      />
    </div>
  );
}

export default function ReviewWritePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    }>
      <ReviewWriteContent />
    </Suspense>
  );
}

