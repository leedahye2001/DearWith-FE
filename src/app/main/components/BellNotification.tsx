"use client";

import { useEffect, useState } from "react";
import BellDefault from "@/svgs/BellDefault.svg";
import { getUnreadNotifications } from "@/apis/api";

export default function BellNotification({ onClick }: { onClick: () => void }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await getUnreadNotifications();
        setCount(res.unreadCount || 0);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUnread();
  }, []);

  return (
    <button className="relative inline-block" onClick={onClick}>
      <span className="block">
        <BellDefault />
      </span>

      {count > 0 && (
        <span
          className="
            absolute -top-1 -right-1
            min-w-[16px] h-[16px]
            flex items-center justify-center
            bg-primary text-white
            text-[10px] font-bold
            rounded-full
            px-[4px]
            leading-none
            z-50
          "
        >
          {count}
        </span>
      )}
    </button>
  );
}
