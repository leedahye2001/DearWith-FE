"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";
import api from "@/apis/instance";

interface EventCardProps {
  id: number;
  imageUrl: string;
  title: string;
  artistNamesKr: string[];
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  eventState: "SCHEDULED" | "IN_PROGRESS" | "ENDED";
}

export default function EventCard({
  id,
  imageUrl,
  title,
  artistNamesKr,
  isLiked,
  onToggleLike,
  eventState,
}: EventCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/event-detail/${id}`);
  };

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(id);

    try {
      if (!isLiked) {
        await api.post(`/api/events/${id}/bookmark`);
      } else {
        await api.delete(`/api/events/${id}/bookmark`);
      }
    } catch (error) {
      console.error("북마크 토글 실패:", error);
    }
  };

  const statusBadge =
    eventState === "SCHEDULED"
      ? "진행 예정"
      : eventState === "ENDED"
      ? "진행 종료"
      : null;

  const isScheduled = eventState === "SCHEDULED";
  const isEnded = eventState === "ENDED";

  return (
    <div className="flex flex-col items-center mb-[38px] relative">
      <div className="relative rounded-[4px] w-[157px] h-[292px] overflow-hidden mb-[10px]">
        {/* 이미지 */}
        <Image
          src={imageUrl || "/images/carousel/생카1.png"}
          alt={title}
          width={157}
          height={220}
          className={`w-full h-full cursor-pointer object-cover`}
          onClick={handleCardClick}
        />

        {/* 💖 좋아요 버튼 항상 위 */}
        <div
          className="absolute top-[7px] right-[7.88px] z-30 cursor-pointer"
          onClick={handleLikeToggle}
        >
          {isLiked ? <HeartFill /> : <HeartDefault />}
        </div>

        {/* 상태 뱃지 항상 위 */}
        {statusBadge && (
          <div className="absolute bottom-[0px] left-[0px] bg-black/40 px-[10px] py-[6px] rounded-l-b[4px] z-30 flex items-center">
            <span className="text-[10px] text-white font-[600]">
              {statusBadge}
            </span>
          </div>
        )}

        {/* 🔹 진행 예정/진행 종료 overlay 처리 */}
        {(isScheduled || isEnded) && (
          <div className="absolute inset-0 bg-white/50 z-20 pointer-events-none" />
        )}
      </div>

      {/* 아티스트 */}
      <div
        className={`flex justify-start w-full mb-[4px] cursor-pointer ${
          isScheduled || isEnded ? "text-white/50" : ""
        }`}
        onClick={handleCardClick}
      >
        <p
          className={`flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 items-center justify-center px-[6px] py-[2px] ${
            isScheduled || isEnded ? "opacity-50" : ""
          }`}
        >
          {artistNamesKr.join(", ")}
        </p>
      </div>

      {/* 제목 */}
      <div
        className={`flex justify-start items-start w-full h-auto cursor-pointer ${
          isScheduled || isEnded ? "text-white/50" : ""
        }`}
        onClick={handleCardClick}
      >
        <p
          className={`text-text-5 text-[14px] font-[600] text-start leading-[20px] ${
            isScheduled || isEnded ? "opacity-50" : ""
          }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
