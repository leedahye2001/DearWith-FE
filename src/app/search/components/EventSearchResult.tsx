import DownSmall from "@/svgs/DownSmall.svg";
import { EventState } from "../page";
import EventSearchListCard, {
  EventSearchListCardProps,
} from "./EventSearchListCard";

interface Props {
  events: EventSearchListCardProps[];
  artistName: string;
  filterState: EventState;
  setFilterState: (v: EventState) => void;
}

const EventSearchResult = ({ events, filterState, setFilterState }: Props) => {
  return (
    <div className="flex flex-col w-full justify-center pt-[16px] px-[24px]">
      <div className="flex justify-between items-center mb-[16px]">
        <h1 className="text-[14px] font-[600] text-text-5">
          검색된 결과 <span className="text-text-3">{events.length}</span>
        </h1>

        <div className="relative">
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as EventState)}
            className="appearance-none border border-primary text-primary text-[12px] font-[600] rounded-[4px] bg-white h-[24px] px-[10px] pr-[28px]"
          >
            <option value="LATEST">최신순</option>
            <option value="UPCOMING">예정순</option>
            <option value="POPULAR">좋아요순</option>
          </select>
          <DownSmall className="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none w-[14px] h-[14px]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[16px] pb-[20px] w-full">
        {events.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
            <p className="text-[12px] text-text-3 text-center font-[400]">
              해당 가수의 이벤트가 없습니다.
            </p>
          </div>
        ) : (
          events.map((event) => (
            <EventSearchListCard key={event.id} {...event} />
          ))
        )}
      </div>
    </div>
  );
};

export default EventSearchResult;
