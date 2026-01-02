"use client";

import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { isNativeApp } from "@/lib/native/bridge";

interface BottombarProps {
  _divProps?: React.ComponentProps<"div">;
  _bottomNode?: React.ReactNode;
}

const Bottombar = ({ _divProps, _bottomNode }: BottombarProps) => {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(isNativeApp());
  }, []);

  const navbarHeight = isNative 
    ? 'calc(60px + env(safe-area-inset-bottom))' 
    : 'calc(80px + env(safe-area-inset-bottom))';

  return (
    <div
      {..._divProps}
      className={twMerge(
        "fixed bottom-0 left-0 right-0 w-full max-w-[428px] mx-auto px-[24px] z-50 bg-white box-border shadow-[0_-32px_32px_rgba(0,0,0,0.03)] flex items-center",
        _divProps?.className
      )}
      style={{
        height: navbarHeight,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {_bottomNode}
    </div>
  );
};

export default Bottombar;
