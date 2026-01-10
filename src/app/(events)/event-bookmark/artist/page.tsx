"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  deleteArtistLike,
  deleteGroupLike,
  getArtistBookmark,
  postArtistLike,
  postGroupLike,
} from "@/apis/api";
import ArtistListCard from "../components/ArtistListCard";

export interface ArtistBookmarkProps {
  id: string;
  nameKr: string;
  imageUrl: string | null;
  type: ArtistType;
  createdAt: string;
  birthDate: string;
  debutDate: string;
  bookmarked: boolean;
}

type CategoryType = "ARTIST" | "GROUP";
type ArtistType = "ARTIST" | "GROUP";

export default function ArtistBookmarkPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<ArtistBookmarkProps[]>([]);
  const [likedArtistsIds, setLikedArtistsIds] = useState<string[]>([]);

  const toggleLike = async (id: string, type: CategoryType) => {
    const isLiked = likedArtistsIds.includes(id);

    try {
      if (isLiked) {
        if (type === "GROUP") await deleteGroupLike(id);
        else await deleteArtistLike(id);
        setLikedArtistsIds((prev) => prev.filter((item) => item !== id));
      } else {
        if (type === "GROUP") await postGroupLike(id);
        else await postArtistLike(id);
        setLikedArtistsIds((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error(error);
      // const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      // const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail ;
      // openAlert(errorMessage);
    }
  };

  const fetchBookmarkedArtists = useCallback(async () => {
    try {
      const res: ArtistBookmarkProps[] = await getArtistBookmark();
      setArtists(res);
      setLikedArtistsIds(res.filter((e) => e.bookmarked).map((e) => e.id));
      return res;
    } catch (error) {
      console.error(error);
      // const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      // const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail;
      // openAlert(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchBookmarkedArtists();
  }, [fetchBookmarkedArtists]);

  return (
    <div className="flex flex-col w-full justify-center pt-[16px] px-[24px]">
      {/* Category Tabs */}
      <div className="flex w-full mt-[12px] border-b border-divider-1">
        <button
          className="flex-1 py-[8px] text-center font-[600] text-text-3"
          onClick={() => router.push("/event-bookmark/event")}
        >
          이벤트
        </button>
        <button
          className="flex-1 py-[8px] text-center font-[600] border-b-[2px] border-primary text-text-5"
          onClick={() => router.push("/event-bookmark/artist")}
        >
          아티스트
        </button>
      </div>

      <div className="flex justify-between items-center my-[16px]">
        <h1 className="text-[14px] font-[600] text-text-5">
          찜한 아티스트
          <span className="text-text-3 ml-1">{artists.length}</span>
        </h1>
      </div>

      <div className="w-full pb-[20px] flex flex-col">
        {artists.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
            <p className="text-[16px] text-text-5 font-[600]">
              아직 찜한 아티스트가 없어요.
            </p>
            <p className="text-[12px] text-text-3">
              마음에 드는 항목을 찜해보세요!
            </p>
          </div>
        ) : (
          artists.map((artist) => (
            <ArtistListCard
              key={`${artist.id}`}
              {...artist}
              bookmarked={likedArtistsIds.includes(artist.id)}
              onToggleLike={() => toggleLike(artist.id, artist.type)}
            />
          ))
        )}
      </div>
    </div>
  );
}
