"use client";

import ProfileBasic from "@/svgs/ProfileBasic.svg";

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="relative flex items-center justify-center">
        {/* 바깥 회전하는 링 */}
        <div className="absolute w-[90px] h-[90px] rounded-full border-4 border-white/20 border-t-primary animate-spin" />

        {/* 가운데 아이콘 */}
        <div className="w-[84px] h-[84px] flex items-center justify-center rounded-full bg-white/10 animate-pulse shadow-lg">
          <ProfileBasic width={48} height={48} />
        </div>
      </div>
    </div>
  );
}
