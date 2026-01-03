"use client";

import { useRouter } from "next/navigation";
import SearchProfileBasic from "@/svgs/SearchProfileBasic.svg";
import Image from "next/image";
import { Artist } from "../page";

const RealTimeSearch = ({
  artist,
  index,
  showRank = false,
}: {
  artist: Artist;
  index: number;
  showRank?: boolean;
}) => {
  const router = useRouter();

  const handleClick = () => {
    const type = artist.type === "GROUP" ? "GROUP" : "ARTIST";
    const idParam = artist.type === "GROUP" ? "groupId" : "artistId";
    const nameParam = artist.type === "GROUP" ? "groupName" : "artistName";
    
    router.push(
      `/search/${artist.id}?type=${encodeURIComponent(type)}&${idParam}=${artist.id}&${nameParam}=${encodeURIComponent(artist.nameKr)}`
    );
  };

  return (
    <div 
      className="flex justify-between w-full items-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-[12px]">
        {showRank && (
          <span className="w-[20px] text-[14px] font-[700] text-primary">
            {index + 1}
          </span>
        )}

        <div className="flex justify-center items-center w-[40px] h-[40px] rounded-full overflow-hidden">
          {artist.imageUrl ? (
            <Image
              src={artist.imageUrl.trim()}
              alt={artist.nameKr}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <SearchProfileBasic />
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-[14px] font-[600] text-text-5">{artist.nameKr}</p>
          <p className="text-[12px] font-[400] text-text-4">
            {artist.type === "GROUP" 
              ? artist.debutDate?.replace(/-/g, ".")
              : artist.birthDate?.replace(/-/g, ".")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RealTimeSearch;
