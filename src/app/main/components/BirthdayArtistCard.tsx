"use client";

import Image from "next/image";

interface BirthdayArtistCardProps {
  id: number;
  nameKo: string;
  imageUrl: string;
}

export default function BirthdayArtistCard({
  id,
  nameKo,
  imageUrl,
}: BirthdayArtistCardProps) {
  return (
    <div key={id} className="flex flex-col items-center mb-[28px]">
      <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center border-[1.5px] border-primary p-[4px] mb-[8px]">
        <div className="w-[64px] h-[64px] rounded-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={nameKo}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="font-[600] text-[12px] text-text-5">🎂 {nameKo} 🎂</div>
    </div>
  );
}
