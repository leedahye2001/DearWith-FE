"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";
import { deleteEventLike, postEventLike } from "@/apis/api";

export interface EventImageVariant {
  name: string;
  url: string;
}

export interface EventImage {
  id: string;
  variants: EventImageVariant[];
}

export interface EventCardProps {
  id: string;
  image: EventImage | null;
  title: string;
  artistNamesKr: string[];
  groupNamesKr: string[];
  bookmarked: boolean;
  onToggleLike: (id: string) => void;
}

export default function MainEventCard({
  id,
  image,
  title,
  artistNamesKr,
  groupNamesKr,
  bookmarked,
  onToggleLike,
}: EventCardProps) {
  const router = useRouter();

  const imageUrl = image?.variants?.[0]?.url || image?.variants?.[1]?.url || "";

  const handleCardClick = () => {
    router.push(`/event-detail/${id}`);
  };

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

  return (
    <div className="flex flex-col items-center mb-[38px]">
      <div className="relative rounded-[4px] w-[180px] h-[257.143px] overflow-hidden mb-[10px]">
        <div
          className="absolute top-[7px] right-[7.88px] z-10 cursor-pointer"
          onClick={handleLikeToggle}
        >
          {bookmarked ? <HeartFill /> : <HeartDefault />}
        </div>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={180}
            height={252}
            className="w-full h-full cursor-pointer object-cover"
            onClick={handleCardClick}
            unoptimized
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
        {artistNamesKr?.length > 0 ? (
          <p className="flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 items-center justify-center px-[6px] py-[2px]">
            {artistNamesKr.join(", ")}
          </p>
        ) : groupNamesKr?.length > 0 ? (
          <p className="flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 items-center justify-center px-[6px] py-[2px]">
            {groupNamesKr.join(", ")}
          </p>
        ) : null}
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
