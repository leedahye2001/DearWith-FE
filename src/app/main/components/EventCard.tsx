"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/event-detail/${id}`);
  };

  return (
    <div className="flex flex-col items-center mb-[38px]">
      {/* 이미지, 좋아요 토글 */}
      <div className="relative rounded-[4px] w-[180px] h-[257.143px] overflow-hidden mb-[10px]">
        {/* ❤️ 좋아요 버튼 */}
        <div
          className="absolute top-[7px] right-[7.88px] z-10 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // 🧠 카드 클릭과 구분
            onToggleLike(id);
          }}
        >
          {isLiked ? <HeartFill /> : <HeartDefault />}
        </div>

        {/* 🖼️ 이벤트 이미지 클릭 시 상세 이동 */}
        <Image
          src={imageUrl}
          alt={title}
          width={180}
          height={257}
          className="w-full h-full cursor-pointer object-cover"
          onClick={handleCardClick}
        />
      </div>

      {/* 아티스트명 */}
      <div
        className="flex justify-start w-full mb-[4px] cursor-pointer"
        onClick={handleCardClick}
      >
        <p className="flex rounded-[4px] bg-red-400 text-[12px] font-[600] text-text-1 items-center justify-center px-[6px] py-[2px]">
          {artistNamesKr.join(", ")}
        </p>
      </div>

      {/* 이벤트 제목 */}
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
