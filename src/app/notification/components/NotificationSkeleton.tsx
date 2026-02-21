"use client";

function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-[4px] bg-bg-2 ${className ?? ""}`}
            aria-hidden
        />
    );
}

const ROW_COUNT = 6;

export default function NotificationSkeleton() {
    return (
        <div className="flex flex-col gap-0">
            {Array.from({ length: ROW_COUNT }).map((_, i) => (
                <div
                    key={i}
                    className="flex justify-between items-start border-b border-divider-1 pb-[16px] mb-[16px] last:mb-0 px-[24px]"
                >
                    <div className="flex gap-[10px] flex-1 min-w-0">
                        <Skeleton className="w-[16px] h-[16px] rounded-full flex-shrink-0" />
                        <div className="flex flex-col gap-[4px] min-w-0 flex-1">
                            <Skeleton className="h-[14px] w-[80px]" />
                            <Skeleton className="h-[14px] w-[120px]" />
                            <Skeleton className="h-[12px] w-[60px] mt-[4px]" />
                        </div>
                    </div>
                    <Skeleton className="w-[24px] h-[24px] rounded flex-shrink-0" />
                </div>
            ))}
        </div>
    );
}
