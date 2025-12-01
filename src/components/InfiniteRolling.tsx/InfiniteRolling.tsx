"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ProfileBasic from "@/svgs/ProfileBasic.svg";

interface Item {
  id: number;
  imageUrl: string | null;
  nameKr: string;
}

export default function InfiniteRolling({ items }: { items: Item[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let pos = 0;
    const speed = 0.4; // 느리게 흐르는 속도

    const animate = () => {
      pos -= speed;

      container.style.transform = `translateX(${pos}px)`;

      const firstChild = container.children[0] as HTMLElement;
      if (firstChild) {
        const firstWidth = firstChild.offsetWidth + 8; // gap 8px 고려

        // 왼쪽으로 완전히 사라지면
        if (Math.abs(pos) >= firstWidth) {
          // 하나 꺼내서 맨 뒤로 붙임 → 진짜 회전초밥
          container.appendChild(firstChild);

          // 위치 보정 (계속 자연스럽게 흐르게)
          pos += firstWidth;
          container.style.transform = `translateX(${pos}px)`;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [items]);

  return (
    <div className="overflow-hidden w-full pb-[20px] pt-[16px]">
      <div
        ref={containerRef}
        className="flex gap-[8px] py-[8px] will-change-transform"
      >
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0">
            {item.imageUrl ? (
              <Image
                width={48}
                height={48}
                src={item.imageUrl?.trim() || ""}
                alt={item.nameKr}
                className="w-[48px] h-[48px] rounded-full object-cover"
              />
            ) : (
              <ProfileBasic />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
