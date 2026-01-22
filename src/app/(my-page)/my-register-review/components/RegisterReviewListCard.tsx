"use client";

import Image from "next/image";

export interface RegisterReviewListCardProps {
  id: string;
  imageUrl: string | null;
  eventTitle: string;
  reviewContent: string;
  createdAt: string;
}

export default function RegisterReviewListCard({
  imageUrl,
  eventTitle,
  reviewContent,
  createdAt,
}: RegisterReviewListCardProps) {
  return (
    <div className="flex w-full cursor-pointer border-b border-divider-1 py-[16px] gap-[12px]">
      <div className="relative w-[60px] h-[60px] rounded-[6px] overflow-hidden bg-gray-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={eventTitle}
            fill
            className="object-cover"
            sizes="60px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-3 text-[12px]">
            이미지 없음
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center flex-1 min-w-0 gap-[4px]">
        <p className="typo-label2 text-text-5">{eventTitle}</p>
        <p className="typo-caption2 text-text-5 line-clamp-1 break-words">
          {reviewContent}
        </p>
        <p className="text-text-2 typo-caption3">
          {(() => {
            const date = new Date(createdAt);
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
          })()}
        </p>
      </div>
    </div>
  );
}
