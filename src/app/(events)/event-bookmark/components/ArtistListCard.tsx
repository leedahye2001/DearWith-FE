"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";

export interface ArtistListCardProps {
  id: string;
  nameKr: string;
  imageUrl: string | null;
  createdAt: string;
  birthDate: string;
  debutDate: string;
  bookmarked: boolean;
  type: "ARTIST" | "GROUP";
  onToggleLike: (id: string, type: "ARTIST" | "GROUP") => void;
}

export default function ArtistListCard({
  id,
  nameKr,
  imageUrl,
  createdAt,
  bookmarked,
  type,
  onToggleLike,
}: ArtistListCardProps) {
  const router = useRouter();

  const handleCardClick = () => router.push(`/event-detail/${id}`);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(id, type);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex justify-between items-center py-[12px] border-b border-divider-1 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-[52px] h-[52px] rounded-full overflow-hidden bg-gray-200">
          {imageUrl && (
            <Image
              src={imageUrl}
              width={52}
              height={52}
              alt={nameKr}
              className="w-full h-full object-cover"
              unoptimized
            />
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-[14px] font-[700] text-text-5">{nameKr}</p>
          <p className="text-[12px] font-[500] text-text-4">{createdAt}</p>
        </div>
      </div>
      <div onClick={handleLikeToggle}>
        {bookmarked ? <HeartFill /> : <HeartDefault />}
      </div>
    </div>
  );
}
