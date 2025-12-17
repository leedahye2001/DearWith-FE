"use client";

import { useEffect, useState, useRef } from "react";
import { twMerge } from "tailwind-merge";

interface CountdownTimerProps {
  minutes: number;
  className?: string;
  _divProps?: React.ComponentProps<"div">;
}

const Countdown = ({ minutes, className, _divProps }: CountdownTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSecondsLeft(minutes * 60);
    
    // 기존 interval 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // 새로운 interval 시작
    if (minutes * 60 > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [minutes]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      {..._divProps}
      className={twMerge("text-text-5 text-[14px] font-[400]", className)}
    >
      {secondsLeft > 0 ? formatTime(secondsLeft) : "00:00"}
    </div>
  );
};

export default Countdown;
