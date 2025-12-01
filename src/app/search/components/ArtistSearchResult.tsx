import Image from "next/image";
import { Artist } from "../page";
import SearchProfileBasic from "@/svgs/SearchProfileBasic.svg";
import Forward from "@/svgs/Forward.svg";
import { useRouter } from "next/navigation";
import { addRecentSearch } from "@/apis/api";

const ArtistSearchResult = ({ artist }: { artist: Artist }) => {
  const router = useRouter();

  const handleClick = async () => {
    // 최근 검색어 추가
    addRecentSearch(artist.nameKr);

    // 검색 결과 페이지 이동
    router.push(
      `/search/${artist.id}?artistId=${
        artist.id
      }&artistName=${encodeURIComponent(artist.nameKr)}`
    );
  };

  return (
    <div
      className="flex justify-between w-full items-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex gap-[12px]">
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
            {artist.birthDate?.replace(/-/g, ".")}
          </p>
        </div>
      </div>
      <Forward />
    </div>
  );
};

export default ArtistSearchResult;
