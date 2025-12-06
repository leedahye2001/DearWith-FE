"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";
import { deleteEventLike, postEventLike } from "@/apis/api";

export interface EventCardProps {
  id: number;
  imageUrl: string;
  title: string;
  artistNamesKr: string[];
  isLiked: boolean;
  onToggleLike: (id: number) => void;
}

export default function MainEventCard({
  id,
  imageUrl,
  title,
  artistNamesKr,
  isLiked,
  onToggleLike,
}: EventCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/event-detail/${id}`);
  };

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭과 구분
    onToggleLike(id); // UI 상태 즉시 반영

    try {
      if (!isLiked) {
        // 좋아요 (북마크) 추가
        await postEventLike;
      } else {
        // 좋아요 취소
        await deleteEventLike;
      }
    } catch (error) {
      console.error("북마크 토글 실패:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mb-[38px]">
      <div className="relative rounded-[4px] w-[180px] h-[257.143px] overflow-hidden mb-[10px]">
        <div
          className="absolute top-[7px] right-[7.88px] z-10 cursor-pointer"
          onClick={handleLikeToggle}
        >
          {isLiked ? <HeartFill /> : <HeartDefault />}
        </div>

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={180}
            height={252}
            className="w-full h-full cursor-pointer object-cover"
            onClick={handleCardClick}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-gray-200 cursor-pointer"
            onClick={handleCardClick}
          >
            <p className="text-text-3 text-[12px]">이미지 없음</p>
          </div>
        )}
      </div>

      <div
        className="flex justify-start w-full mb-[4px] cursor-pointer"
        onClick={handleCardClick}
      >
        <p className="flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 items-center justify-center px-[6px] py-[2px]">
          {artistNamesKr.join(", ")}
        </p>
      </div>

      <div
        className="flex justify-start items-start w-full h-auto cursor-pointer"
        onClick={handleCardClick}
      >
        <p className="text-text-5 text-[14px] font-[600] text-start leading-[20px]">
          {title}
        </p>
      </div>
    </div>
  );
}
