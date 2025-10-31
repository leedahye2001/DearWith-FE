"use client";

import Image from "next/image";

interface BirthdayArtistCardProps {
  id: number;
  nameKo: string;
  imageUrl: string;
  birthDate: string;
}

export default function BirthdayArtistCard({
  id,
  nameKo,
  imageUrl,
  birthDate,
}: BirthdayArtistCardProps) {
  // 오늘 YYYY-MM-DD 형식
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = `${month}-${day}`;

  // 생일 월-일 추출
  const birthMonthDay = birthDate.slice(5); // "YYYY-MM-DD" → "MM-DD"

  const isBirthday = birthMonthDay === todayStr;

  return (
    <div key={id} className="flex flex-col items-center mb-[28px]">
      <div
        className={`w-[72px] h-[72px] rounded-full flex items-center justify-center p-[4px] mb-[8px] ${
          isBirthday ? "border-[1.5px] border-primary" : ""
        }`}
      >
        <div className="w-[64px] h-[64px] rounded-full overflow-hidden">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={nameKo}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="font-[600] text-[12px] text-text-5">
        {isBirthday ? `🎂 ${nameKo} 🎂` : nameKo}
      </div>
    </div>
  );
}
