"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";

export interface EventListCardProps {
  id: number;
  imageUrl: string;
  title: string;
  artistNamesKr: string[];
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  eventState?: "SCHEDULED" | "IN_PROGRESS" | "ENDED";
}

export default function EventListCard({
  id,
  imageUrl,
  title,
  artistNamesKr,
  isLiked,
  onToggleLike,
  eventState,
}: EventListCardProps) {
  const router = useRouter();

  const handleCardClick = () => router.push(`/event-detail/${id}`);
  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(id); // 🔹 Page에서 API 호출
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
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={157}
            height={220}
            className="w-full h-full cursor-pointer object-cover"
            onClick={handleCardClick}
          />
        ) : null}

        <div
          className="absolute top-[7px] right-[7.88px] z-30 cursor-pointer"
          onClick={handleLikeToggle}
        >
          {isLiked ? <HeartFill /> : <HeartDefault />}
        </div>

        {statusBadge && (
          <div className="absolute bottom-0 left-0 bg-black/40 px-[10px] py-[6px] z-30">
            <span className="text-[10px] text-white font-[600]">
              {statusBadge}
            </span>
          </div>
        )}

        {(isScheduled || isEnded) && (
          <div className="absolute inset-0 bg-white/50 z-20 pointer-events-none" />
        )}
      </div>

      <div
        className={`flex justify-start w-full mb-[4px] cursor-pointer ${
          isScheduled || isEnded ? "text-white/50" : ""
        }`}
        onClick={handleCardClick}
      >
        <p className="flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 items-center justify-center px-[6px] py-[2px]">
          {artistNamesKr.join(", ")}
        </p>
      </div>

      <div
        className={`flex justify-start items-start w-full cursor-pointer ${
          isScheduled || isEnded ? "text-white/50" : ""
        }`}
        onClick={handleCardClick}
      >
        <p className="text-text-5 text-[14px] font-[600] leading-[20px]">
          {title}
        </p>
      </div>
    </div>
  );
}
