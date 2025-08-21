"use client";

import Image from "next/image";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";

interface EventCardProps {
  id: number;
  imageUrl: string;
  title: string;
  artistNamesKr: string[];
  isLiked: boolean;
  onToggleLike: (id: number) => void;
}

export default function EventCard({
  id,
  imageUrl,
  title,
  artistNamesKr,
  isLiked,
  onToggleLike,
}: EventCardProps) {
  return (
    <div className="flex flex-col items-center mb-[38px]">
      {/* 이미지, 좋아요 토글 */}
      <div className="relative rounded-[4px] w-[180px] h-[257.143px] overflow-hidden mb-[10px]">
        <div
          className="absolute top-[7px] right-[7.88px] cursor-pointer"
          onClick={() => onToggleLike(id)}
        >
          {isLiked ? <HeartFill /> : <HeartDefault />}
        </div>

        <Image
          src={imageUrl}
          alt={title}
          width={180}
          height={257}
          className="w-full h-full"
        />
      </div>

      {/* 아티스트명 */}
      <div className="flex justify-start w-full mb-[4px]">
        <p className="flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 items-center justify-center px-[6px] py-[2px]">
          {artistNamesKr}
        </p>
      </div>

      {/* 이벤트 제목 */}
      <div className="flex justify-start items-start w-full h-auto">
        <p className="text-text-5 text-[14px] font-[600] text-start leading-[20px]">
          {title}
        </p>
      </div>
    </div>
  );
}
