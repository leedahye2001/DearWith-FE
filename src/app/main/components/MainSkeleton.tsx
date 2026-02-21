"use client";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[4px] bg-bg-2 ${className ?? ""}`}
      aria-hidden
    />
  );
}

export default function MainSkeleton() {
  return (
    <div className="flex flex-col w-full justify-center">
      {/* 캐러셀 영역 */}
      <Skeleton className="w-full h-[211px] mb-[24px]" />

      {/* 이벤트 섹션 x3 */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-[24px]">
          <div className="pl-[24px] pb-[12px] flex flex-col gap-[6px]">
            <Skeleton className="h-[16px] w-[140px]" />
            <Skeleton className="h-[16px] w-[100px]" />
          </div>
          <div className="flex gap-[12px] overflow-hidden px-[24px]">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex flex-col flex-shrink-0">
                <Skeleton className="w-[180px] h-[257px] rounded-[4px] mb-[10px]" />
                <Skeleton className="h-[20px] w-[60px] rounded-[4px] mb-[4px]" />
                <Skeleton className="h-[14px] w-[160px]" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 리뷰 섹션 */}
      <div className="mb-[24px]">
        <div className="pl-[24px] pb-[12px] flex flex-col gap-[6px]">
          <Skeleton className="h-[16px] w-[120px]" />
          <Skeleton className="h-[16px] w-[80px]" />
        </div>
        <div className="flex flex-col gap-[8px] px-[24px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-[10px] p-[12px] border border-divider-1 rounded-[4px]">
              <Skeleton className="w-[40px] h-[40px] shrink-0 rounded-[4px]" />
              <div className="flex flex-col gap-[6px] flex-1 min-w-0">
                <Skeleton className="h-[14px] w-[60%]" />
                <Skeleton className="h-[12px] w-[90%]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOT 아티스트 문구 + 롤링 영역 */}
      <div className="text-center mb-[8px]">
        <div className="inline-flex flex-col gap-[6px] items-center">
          <Skeleton className="h-[16px] w-[180px]" />
          <Skeleton className="h-[16px] w-[220px]" />
        </div>
      </div>
      <Skeleton className="h-[72px] mx-[24px] rounded-[4px] mb-[20px]" />

      {/* 하단 버튼 2개 */}
      <div className="flex gap-[11px] px-[24px] mb-[60px]">
        <Skeleton className="flex-1 h-[44px] rounded-[4px]" />
        <Skeleton className="flex-1 h-[44px] rounded-[4px]" />
      </div>
    </div>
  );
}
