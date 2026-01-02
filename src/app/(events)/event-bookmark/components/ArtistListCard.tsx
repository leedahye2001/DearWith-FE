"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";
import BookmarkArtistProfile from "@/svgs/BookmarkArtistProfile.svg";

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
  birthDate,
  createdAt,
  bookmarked,
  type,
  onToggleLike,
}: ArtistListCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (type === "GROUP") {
      router.push(`/search/${id}?type=${encodeURIComponent(type)}&groupId=${id}&groupName=${encodeURIComponent(nameKr)}`);
    } else {
      router.push(`/search/${id}?type=${encodeURIComponent(type)}&artistId=${id}&artistName=${encodeURIComponent(nameKr)}`);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "";
  
    const d = new Date(value);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
  
    return `${yyyy}.${mm}.${dd}`;
  };
  
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
        <div className="w-[52px] h-[52px] rounded-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              width={52}
              height={52}
              alt={nameKr}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <BookmarkArtistProfile className="w-full h-full" />
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-[14px] font-[500] text-text-5">{nameKr}</p>
          {birthDate ? (
            <p className="text-[12px] font-[400] text-text-3">
              {formatDate(birthDate)}
            </p>
          ) : createdAt ? (
            <p className="text-[12px] font-[400] text-text-3">
              {formatDate(createdAt)}
            </p>
          ) : null}
        </div>

      </div>
      <div onClick={handleLikeToggle}>
        {bookmarked ? <HeartFill /> : <HeartDefault />}
      </div>
    </div>
  );
}
