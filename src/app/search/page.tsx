"use client";

import Input from "@/components/Input/Input";
import Search from "@/svgs/Search.svg";
import CancelSmall from "@/svgs/CancelSmall.svg";
import { useEffect, useState } from "react";
import {
  deletRecentAllSearch,
  deletRecentSearch,
  getArtistGroupSearch,
  getEventSearch,
  getHotArtistGroupTopTwenty,
  getRecentSearch,
} from "@/apis/api";
import ArtistSearchResult from "./components/ArtistSearchResult";
import RealTimeSearch from "./components/RealTimeSearch";
import { EventCardProps } from "../main/components/MainEventCard";
import useCurrentHourLabel from "@/utils/useCurrentHourLabel";

export interface Artist {
  id: number;
  nameKr: string;
  nameEn: string;
  birthDate?: string;
  debutDate?: string;
  imageUrl: string;
  type: string;
}

export interface EventProps {
  id: number;
  title: string;
  imageUrl: string | null;
  artistNamesEn?: string[];
  artistNamesKr?: string[];
  startDate: string;
  endDate: string;
  bookmarkCount?: number;
  bookmarked?: boolean;
}

export type EventState = "LATEST" | "UPCOMING" | "POPULAR";

const Page = () => {
  const [search, setSearch] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [hotArtists, setHotArtists] = useState<Artist[]>([]);
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [category] = useState<"ARTIST" | "EVENT">("ARTIST");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const hourLabel = useCurrentHourLabel();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await getRecentSearch();
        setRecentSearches(res || []);
      } catch (err) {
        console.error("최근 검색어 불러오기 실패:", err);
      }
    };

    fetchRecent();
  }, []);

  const handleDeleteRecent = async (query: string) => {
    try {
      await deletRecentSearch(query);
      setRecentSearches((prev) => prev.filter((q) => q !== query));
    } catch (err) {
      console.error("최근 검색어 삭제 실패:", err);
    }
  };

  const handleDeleteRecentAll = async () => {
    try {
      await deletRecentAllSearch();
      setRecentSearches([]);
    } catch (err) {
      console.error("최근 검색어 전체 삭제 실패:", err);
    }
  };

  useEffect(() => {
    const fetchHotArtists = async () => {
      try {
        const res = await getHotArtistGroupTopTwenty();
        setHotArtists(res || []);
      } catch (err) {
        console.error("실시간 검색어 불러오기 실패:", err);
      }
    };

    fetchHotArtists();
  }, []);

  // 검색 동작
  const handleSearchChange = async (value: string) => {
    setSearch(value);

    if (!value) {
      setArtists([]);
      setEvents([]);
      return;
    }

    try {
      if (category === "ARTIST") {
        const res = await getArtistGroupSearch(value);
        setArtists(res || []);
      } else {
        const res = await getEventSearch(value);
        setEvents(res || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center gap-[12px]">
      {/* 검색창 */}
      <div className="sticky top-0 z-10 bg-bg-1 flex w-full justify-center">
        <Input
          _value={search}
          _state="textbox-basic"
          _rightNode={<Search />}
          _onChange={handleSearchChange}
          _inputProps={{
            placeholder: "어떤 가수의 이벤트를 찾고있나요?",
            className: `placeholder:text-text-3`,
          }}
          _containerProps={{ className: `py-[10px] w-full px-[24px]` }}
        />
      </div>

      {recentSearches.length > 0 && (
        <div className="flex flex-col gap-[16px] mt-[12px] px-[24px] w-full">
          <div className="flex justify-between">
            <h3 className="typo-title3 text-text-5">최근 검색어</h3>
            <button
              onClick={handleDeleteRecentAll}
              className="typo-caption3 text-text-3 hover:cursor-pointer"
            >
              모두 지우기
            </button>
          </div>

          {recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((query) => (
                <div
                  key={query}
                  className="flex items-center text-text-5 rounded-[4px] px-[6px] py-1 typo-caption3 gap-1 border-[1px] border-primary"
                >
                  <span>{query}</span>
                  <button
                    onClick={() => handleDeleteRecent(query)}
                    className="text-text-3 font-bold"
                  >
                    <CancelSmall />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-[20px] overflow-y-auto w-full mb-[20px] mt-[12px]">
        {search && (
          <h1 className="px-[24px] typo-title3 text-text-5">
            &apos;{search}&apos;에 대한 검색 결과
          </h1>
        )}

        {search ? (
          category === "ARTIST" ? (
            artists.length === 0 ? (
              <p className="typo-caption3 text-text-3 flex justify-center items-center h-[500px]">
                검색 결과가 없습니다.
              </p>
            ) : (
              artists
                .slice(0, 10)
                .map((artist) => (
                  <ArtistSearchResult key={artist.id} artist={artist} />
                ))
            )
          ) : events.length === 0 ? (
            <p className="typo-caption3 text-text-3 flex justify-center items-center h-[500px]">
              검색 결과가 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-[12px] px-[24px]">
              {events.slice(0, 10).map((event) => (
                <div key={event.id} className="p-4 border rounded">
                  <h3>{event.title}</h3>
                  {/* 이벤트 카드 컴포넌트 추가 */}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex flex-col gap-[20px] mt-[12px] px-[24px] w-full">
            <div className="flex justify-between">
              <h3 className="typo-title3 text-text-5">
                실시간 검색어
              </h3>
              <p className="typo-caption3 text-text-3">{hourLabel}</p>
            </div>
            {hotArtists.map((artist, index) => (
              <RealTimeSearch
                key={`${artist.id}-${index}`}
                artist={artist}
                index={index}
                showRank
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
