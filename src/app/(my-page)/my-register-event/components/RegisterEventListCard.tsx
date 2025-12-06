"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";
import { deleteEventLike, postEventLike } from "@/apis/api";

export interface RegisterEventListCardProps {
  id: string;
  imageUrl: string;
  title: string;
  artistNamesKr: string;
  bookmarked: boolean;
  onToggleLike: (id: string) => void;
  eventState?: "SCHEDULED" | "IN_PROGRESS" | "ENDED";
}

export default function RegisterEventListCard({
  id,
  imageUrl,
  title,
  artistNamesKr,
  bookmarked,
  onToggleLike,
  eventState,
}: RegisterEventListCardProps) {
  const router = useRouter();

  const handleCardClick = () => router.push(`/event-detail/${id}`);
  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(id);

    try {
      if (!bookmarked) {
        await postEventLike(id);
      } else {
        await deleteEventLike(id);
      }
    } catch (error) {
      console.error("북마크 토글 실패:", error);
    }
  };

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
          {bookmarked ? <HeartFill /> : <HeartDefault />}
        </div>
      </div>

      <div
        className={`flex justify-start w-full mb-[4px] cursor-pointer ${
          isScheduled || isEnded ? "text-white/50" : ""
        }`}
        onClick={handleCardClick}
      >
        <p className="flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 items-center justify-center px-[6px] py-[2px]">
          {artistNamesKr}
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
