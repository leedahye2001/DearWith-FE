"use client";

import { useEffect, useState } from "react";
import Backward from "@/svgs/Backward.svg";
import Topbar from "@/components/template/Topbar";
import { useRouter } from "next/navigation";
import { getMyRegisterReview } from "@/apis/api";
import RegisterReviewListCard from "./components/RegisterReviewListCard";

export interface MyReviewResponseItem {
  eventId: string;
  reviewId: string;
  imageUrl: string;
  eventTitle: string;
  reviewContent: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterReviewCardProps {
  id: string;
  imageUrl: string | null;
  eventTitle: string;
  reviewContent: string;
  createdAt: string;
}

const MyRegisteredReviews = () => {
  const [reviews, setReviews] = useState<RegisterReviewCardProps[]>([]);
  const router = useRouter();

  const handleBackRouter = () => router.back();

  const fetchData = async () => {
    try {
      const res = await getMyRegisterReview();
      const list: MyReviewResponseItem[] = res?.content || [];

      const mapped = list.map((item) => ({
        id: item.reviewId,
        imageUrl: item.imageUrl || null,
        eventTitle: item.eventTitle,
        reviewContent: item.reviewContent,
        createdAt: item.createdAt,
      }));

      setReviews(mapped);
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
        _topNode="내가 작성한 리뷰"
      />

      <div className="flex flex-col w-full justify-center pt-[16px] px-[24px]">
        <div className="flex justify-between items-center mb-[16px]">
          <div className="flex items-center gap-[6px]">
            <h1 className="text-[14px] font-[600] text-text-5">작성한 리뷰</h1>
            <span className="text-text-3 font-[600]">{reviews.length}</span>
          </div>
        </div>

        <div className="flex flex-col w-full">
          {reviews.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
              <p className="text-[12px] text-text-3 text-center font-[400]">
                작성한 리뷰가 없습니다.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <RegisterReviewListCard key={review.id} {...review} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyRegisteredReviews;
