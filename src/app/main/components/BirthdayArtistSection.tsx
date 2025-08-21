"use client";

import BirthdayArtistCard from "./BirthdayArtistCard";

interface BirthdayArtistsSectionProps {
  currentMonth: number | string;
  birthdayArtists: { id: number; nameKo: string; imageUrl: string }[];
}

export default function BirthdayArtistsSection({
  currentMonth,
  birthdayArtists,
}: BirthdayArtistsSectionProps) {
  return (
    <div>
      <h1 className="font-[700] text-text-5 text-[16px] pb-[8px]">
        {currentMonth} 생일 아티스트
      </h1>
      <div className="flex gap-[8px]">
        {birthdayArtists.map((artist) => (
          <BirthdayArtistCard
            key={artist.id}
            id={artist.id}
            nameKo={artist.nameKo}
            imageUrl={artist.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
