"use client";

import EventCard from "./MainEventCard";
import { ReactNode } from "react";

interface EventImageVariant {
  name: string;
  url: string;
}

export interface EventImage {
  id: string;
  variants: EventImageVariant[];
}

export interface Event {
  id: string;
  images?: EventImage[];
  title: string;
  artistNamesKr: string[];
  groupNamesKr: string[];
}

interface EventSectionProps {
  title: ReactNode;
  events: Event[];
  likedIds: string[];
  onToggleLike: (id: string) => void;
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
            image={event.images?.[0] ?? null}
            title={event.title}
            artistNamesKr={event.artistNamesKr}
            groupNamesKr={event.groupNamesKr}
            bookmarked={likedIds.includes(event.id)}
            onToggleLike={onToggleLike}
          />
        ))}
      </div>
    </div>
  );
}
