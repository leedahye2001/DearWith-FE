"use client";

import { useParams, useRouter } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import EventReview from "../../components/EventReview";
import { getEventDetail } from "@/apis/api";
import { useEffect, useState, Suspense } from "react";
import Spinner from "@/components/Spinner/Spinner";

export default function EventReviewPage() {
  const router = useRouter();
  const handleBackRouter = () => router.back();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [eventTitle, setEventTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const data = await getEventDetail(id);
        setEventTitle(data.title || "");
      } catch (error) {
        console.error(error);
        // const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
        // const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail;
        // openAlert(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center mb-[50px]">
      <Topbar
        _leftImage={
          <button onClick={handleBackRouter}>
            <Backward onClick={handleBackRouter} />
          </button>
        }
        _topNode={eventTitle || "리뷰"}
      />

      {/* 탭 */}
      <div className="flex justify-around border-b border-divider-1 mt-[4px]">
        <button
          onClick={() => router.push(`/event-detail/${id}`)}
          className={`w-1/2 py-[12px] text-[14px] font-[600] ${
            "text-text-3"
          }`}
        >
          홈
        </button>
        <button
          onClick={() => router.push(`/event-detail/${id}/review`)}
          className={`w-1/2 py-[12px] text-[14px] font-[600] ${
            "text-primary border-b-[2px] border-primary"
          }`}
        >
          리뷰
        </button>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center h-[400px]">
          <Spinner />
        </div>
      }>
        <EventReview eventId={id || ""} />
      </Suspense>
    </div>
  );
}
