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
import EventSearchResult from "./components/EventSearchResult";
import RealTimeSearch from "./components/RealTimeSearch";
import { EventCardProps } from "../main/components/MainEventCard";
import useCurrentHourLabel from "@/utils/useCurrentHourLabel";

export interface Artist {
  id: number;
  nameKr: string;
  nameEn: string;
  birthDate: string;
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
  const [category, setCategory] = useState<"ARTIST" | "EVENT">("ARTIST");
  const [filterState, setFilterState] = useState<EventState>("LATEST");
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
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center mt-[54px] gap-[12px]">
      {/* 검색창 */}
      <div className="flex w-full justify-center">
        <Input
          _value={search}
          _state="textbox-basic"
          _rightNode={<Search />}
          _onChange={handleSearchChange}
          _inputProps={{
            placeholder: "어떤 가수의 이벤트를 찾고있나요?",
            className: `placeholder:text-text-3`,
          }}
          _containerProps={{ className: `py-[10px]` }}
        />
      </div>

      {/* 카테고리 탭 */}
      {/* <div className="flex w-full mt-[12px] border-b border-divider-1">
        <button
          className={`flex-1 py-[8px] text-center font-[600] ${
            category === "ARTIST"
              ? "border-b-[2px] border-primary text-text-5"
              : "text-text-3"
          }`}
          onClick={() => setCategory("ARTIST")}
        >
          아티스트
        </button>
        <button
          className={`flex-1 py-[8px] text-center font-[600] ${
            category === "EVENT"
              ? "border-b-[2px] border-primary text-text-5"
              : "text-text-3"
          }`}
          onClick={() => setCategory("EVENT")}
        >
          이벤트
        </button>
      </div> */}
      {recentSearches.length > 0 && (
        <div className="flex flex-col gap-[16px] mt-[12px] px-[24px] w-full">
          <div className="flex justify-between">
            <h3 className="font-[700] text-[16px] text-text-5">최근 검색어</h3>
            <button
              onClick={handleDeleteRecentAll}
              className="text-[12px] font-[500] text-text-3 hover:cursor-pointer"
            >
              모두 지우기
            </button>
          </div>

          {recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((query) => (
                <div
                  key={query}
                  className="flex items-center text-text-5 rounded-[4px] px-[6px] py-1 text-[12px] gap-1 border-[1px] border-primary"
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
          <h1 className="px-[24px] text-[16px] font-[700] text-text-5">
            '{search}'에 대한 검색 결과
          </h1>
        )}

        {search ? (
          category === "ARTIST" ? (
            artists.length === 0 ? (
              <p className="text-[12px] text-text-3 flex justify-center items-center h-[500px]">
                검색 결과가 없습니다.
              </p>
            ) : (
              artists
                .slice(0, 10)
                .map((artist) => (
                  <ArtistSearchResult key={artist.id} artist={artist} />
                ))
            )
          ) : (
            <></>
          )
        ) : (
          // events.length === 0 ? (
          //   <p className="text-[12px] text-text-3 flex justify-center items-center h-[500px]">
          //     검색 결과가 없습니다.
          //   </p>
          // ) : (
          //   events
          //     .slice(0, 10)
          //     .map((event) => (
          //       <EventSearchResult
          //         key={event.id}
          //         events={events.slice(0, 10)}
          //         filterState={filterState}
          //         setFilterState={setFilterState}
          //         artistName={search}
          //       />
          //     ))
          // )
          <div className="flex flex-col gap-[20px] mt-[12px] px-[24px] w-full">
            <div className="flex justify-between">
              <h3 className="font-[700] text-[16px] text-text-5">
                실시간 검색어
              </h3>
              <p className="text-[12px] font-[500] text-text-3">{hourLabel}</p>
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
