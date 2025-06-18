"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface CountdownTimerProps {
  minutes: number;
  className?: string;
  _divProps?: React.ComponentProps<"div">;
}

const Countdown = ({ minutes, className, _divProps }: CountdownTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    setSecondsLeft(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // 초기화
  }, [secondsLeft]);

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
