interface RefreshIconProps {
  /** true면 3바퀴 후 정지, false면 무한 회전 (당기는 중) */
  isRefreshing?: boolean;
  className?: string;
  size?: number;
}

export default function RefreshIcon({
  isRefreshing = false,
  className = "",
  size = 24,
}: RefreshIconProps) {
  return (
    <svg
      className={`text-text-3 ${isRefreshing ? "animate-spin-3" : "animate-spin"} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 4v6h-6" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}
