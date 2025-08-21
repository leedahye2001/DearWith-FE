"use client";

import EventCard from "./EventCard";
import { ReactNode } from "react";

interface Event {
  id: number;
  imageUrl: string;
  title: string;
  artistNamesKr: string[];
}

interface EventSectionProps {
  title: ReactNode; // title을 커스텀하기 위함
  events: Event[];
  likedIds: number[];
  onToggleLike: (id: number) => void;
}

export default function EventSection({
  title,
  events,
  likedIds,
  onToggleLike,
}: EventSectionProps) {
  return (
    <div>
      <h1 className="font-[700] text-text-5 text-[16px] pb-[12px] pl-[24px]">
        {title}
      </h1>
      <div className="flex gap-[12px] overflow-x-auto scrollbar-hide touch-pan-x px-[24px]">
        {events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            imageUrl={event.imageUrl}
            title={event.title}
            artistNamesKr={event.artistNamesKr}
            isLiked={likedIds.includes(event.id)}
            onToggleLike={onToggleLike}
          />
        ))}
      </div>
    </div>
  );
}
