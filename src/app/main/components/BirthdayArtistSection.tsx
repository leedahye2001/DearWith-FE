"use client";

import BirthdayArtistCard from "./BirthdayArtistCard";

interface BirthdayArtistsSectionProps {
  currentMonth: number | string;
  birthdayArtists: {
    id: number;
    nameKr: string;
    imageUrl: string;
    birthDate: string;
  }[];
}

export default function BirthdayArtistsSection({
  currentMonth,
  birthdayArtists,
}: BirthdayArtistsSectionProps) {
  return (
    <div>
      <h1 className="font-[700] text-text-5 text-[16px] pb-[8px] pl-[24px]">
        {currentMonth} 생일 아티스트
      </h1>
      <div className="flex gap-[8px] overflow-x-auto scrollbar-hide touch-pan-x px-[24px]">
        {birthdayArtists.map((artist) => (
          <BirthdayArtistCard
            key={artist.id}
            id={artist.id}
            nameKr={artist.nameKr}
            birthDate={artist.birthDate}
            imageUrl={artist.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
