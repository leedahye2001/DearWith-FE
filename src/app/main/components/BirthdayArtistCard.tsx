"use client";

import Image from "next/image";

interface BirthdayArtistCardProps {
  id: string;
  nameKr: string;
  imageUrl: string;
  birthDate: string;
}

export default function BirthdayArtistCard({
  id,
  nameKr,
  imageUrl,
  birthDate,
}: BirthdayArtistCardProps) {
  // 오늘 YYYY-MM-DD 기준 → MM-DD만 비교
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = `${month}-${day}`;

  const birthMonthDay =
    typeof birthDate === "string" && birthDate.length >= 10
      ? birthDate.slice(5)
      : "";

  const isBirthday = birthMonthDay === todayStr;

  return (
    <div key={id} className="flex flex-col items-center mb-[28px]">
      <div
        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center p-[4px] mb-[8px] transition-all ${
          isBirthday ? "border-[2px] border-primary" : "border-none"
        }`}
      >
        <div className="w-[64px] h-[64px] rounded-full overflow-hidden">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={nameKr}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              unoptimized
            />
          )}
        </div>
      </div>

      <div className="font-[600] text-[12px] text-text-5">
        {isBirthday ? `🎂 ${nameKr} 🎂` : nameKr}
      </div>
    </div>
  );
}
