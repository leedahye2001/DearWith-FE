import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Share from "@/svgs/Share.svg";
import HeartDefault from "@/svgs/HeartDefault.svg";
import Twitter from "@/svgs/Twitter.svg";
import Clock from "@/svgs/Clock.svg";
import Location from "@/svgs/Location.svg";
import Place from "@/svgs/Place.svg";
import KakaoMap from "./components/KakaoMap";

const Page = () => {
  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar _leftImage={<Backward />} _topNode="Dowoon Lovers Club" />
      <div className="flex justify-between w-full">
        <div className="flex items-center justify-center w-full font-[600] text-[16px] h-[45px] text-text-6 bg-bg-1 border-b-[2px] border-primary">
          홈
        </div>
        <div className="flex items-center justify-center w-full font-[600] text-[16px] h-[45px] text-text-3 bg-bg-1 border-b-[1px] border-divider-1">
          리뷰
        </div>
      </div>
      <div className="h-[536px] bg-divider-1" />
      <div className="p-[24px]">
        <div className="flex justify-between items-center pb-[8px] pt-[28px]">
          <div className="px-[6px] py-[2px] bg-[#F86852] text-text-1 w-[33px] h-[20px] text-[12px] font-[600] rounded-[4px] flex justify-center items-center">
            도운
          </div>
          <div className="flex gap-[4px]">
            <Share />
            <HeartDefault />
          </div>
        </div>
        <h1 className="font-[700] text-[24px] text-text-5 pb-[16px]">
          도운 러버스 클럽 : Dowoon Lovers Club
        </h1>
        <div className="flex items-center justify-start">
          <Twitter />
          <h2 className="font-[600] text-[14px] text-text-5 pl-[8px] pr-[16px]">
            주최
          </h2>
          <p className="font-[400] text-[12px] text-text-5 underline">
            @dw_lovers_club
          </p>
        </div>
        <div className="flex items-center justify-start">
          <Clock />
          <h2 className="font-[600] text-[14px] text-text-5 pl-[8px] pr-[16px]">
            기간
          </h2>
          <p className="font-[400] text-[12px] text-text-5">
            25.08.23 12:00 - 25.08.25 20:00
          </p>
        </div>
        <div className="flex items-center justify-start">
          <Location />
          <h2 className="font-[600] text-[14px] text-text-5 pl-[8px] pr-[16px]">
            주소
          </h2>
          <p className="font-[400] text-[12px] text-text-5 pr-[4px]">
            서울시 마포구 와우산로 29바길 10
          </p>
          <div className="px-[8px] py-[2px] bg-[#FFE5AF] text-text-5 min-w-[33px] h-[20px] text-[11px] font-[600] rounded-[4px] flex justify-center items-center">
            홍대·합정
          </div>
        </div>
        <div className="flex items-center justify-start">
          <Place />
          <h2 className="font-[600] text-[14px] text-text-5 pl-[8px] pr-[16px]">
            장소
          </h2>
          <p className="font-[400] text-[12px] text-text-5">몰리스 피크닉</p>
        </div>
      </div>
      <div className="p-[24px]">
        <h3 className="flex justify-start items-center w-full font-[700] text-[16px] text-text-5 mb-[12px]">
          기본 특전
        </h3>
        <div className="grid grid-cols-3 gap-[12px]">
          <div className="flex flex-col justify-center items-center min-min-w-[101px] min-h-[132px] border-divider-1 border-[0.8px] gap-[8px] px-[16.5px] py-[20px]">
            <div className="w-[68px] h-[68px] bg-divider-1 rounded-[40px]" />
            <p className="text-[12px] font-[600] text-text-5">종이컵</p>
          </div>
          <div className="flex flex-col justify-center items-center min-w-[101px] min-h-[132px] border-divider-1 border-[0.8px] gap-[8px] px-[16.5px] py-[20px]">
            <div className="w-[68px] h-[68px] bg-divider-1 rounded-[40px]" />
            <p className="text-[12px] font-[600] text-text-5">엽서</p>
          </div>
          <div className="flex flex-col justify-center items-center min-w-[101px] min-h-[132px] border-divider-1 border-[0.8px] gap-[8px] px-[16.5px] py-[20px]">
            <div className="w-[68px] h-[68px] bg-divider-1 rounded-[40px]" />
            <p className="text-[12px] font-[600] text-text-5">달력</p>
          </div>
          <div className="flex flex-col justify-center items-center min-w-[101px] min-h-[132px] border-divider-1 border-[0.8px] gap-[8px] px-[16.5px] py-[20px]">
            <div className="w-[68px] h-[68px] bg-divider-1 rounded-[40px]" />
            <p className="text-[12px] font-[600] text-text-5">떡메모지</p>
          </div>
          <div className="flex flex-col justify-center items-center min-w-[101px] min-h-[132px] border-divider-1 border-[0.8px] gap-[8px] px-[16.5px] py-[20px]">
            <div className="w-[68px] h-[68px] bg-divider-1 rounded-[40px]" />
            <p className="text-[12px] font-[600] text-text-5">미니포스터</p>
          </div>
        </div>
      </div>
      <div className="p-[24px]">
        <h3 className="flex justify-start items-center w-full font-[700] text-[16px] text-text-5 mb-[12px]">
          선착 특전
        </h3>
        <div className="grid grid-cols-3 gap-[12px]">
          <div className="flex flex-col justify-center items-center min-w-[101px] min-h-[132px] border-divider-1 border-[0.8px] gap-[8px] px-[16.5px] py-[20px]">
            <div className="w-[68px] h-[68px] bg-divider-1 rounded-[40px]" />
            <div className="flex flex-col justify-center items-center">
              <p className="text-[10px] font-[400] text-text-4">1일차</p>
              <p className="text-[12px] font-[600] text-text-5">시리얼 볼</p>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center min-w-[101px] min-h-[132px] border-divider-1 border-[0.8px] gap-[8px] px-[16.5px] py-[20px]">
            <div className="w-[68px] h-[68px] bg-divider-1 rounded-[40px]" />
            <div className="flex flex-col justify-center items-center">
              <p className="text-[10px] font-[400] text-text-4">2일차</p>
              <p className="text-[12px] font-[600] text-text-5">그립톡</p>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center min-w-[101px] min-h-[132px] border-divider-1 border-[0.8px] gap-[8px] px-[16.5px] py-[20px]">
            <div className="w-[68px] h-[68px] bg-divider-1 rounded-[40px]" />
            <div className="flex flex-col justify-center items-center">
              <p className="text-[10px] font-[400] text-text-4">3일차</p>
              <p className="text-[12px] font-[600] text-text-5">미니액자</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-[24px]">
        <h3 className="flex justify-start items-center w-full font-[700] text-[16px] text-text-5 mb-[12px]">
          위치
        </h3>
        <KakaoMap address="서울특별시 마포구 와우산로 29바길 10" />
      </div>

      <div className="p-[24px]">
        <div className="flex justify-between w-full items-center mb-[16px]">
          <h3 className="flex items-center font-[700] text-[16px] text-text-5">
            공지사항
          </h3>
          <p className="text-[12px] font-[400] text-text-3">더 보기</p>
        </div>

        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-col w-full justify-start items-start w-full min-h-[36px] border-divider-1 border-[0.8px] p-[12px]">
            <p className="text-[14px] font-[600] text-text-5">
              2일차 럭키드로우 운영 안내
            </p>
            <p className="text-[12px] font-[400] text-text-4">25.08.26 11:30</p>
          </div>
          <div className="flex flex-col w-full justify-start items-start w-full min-h-[36px] border-divider-1 border-[0.8px] p-[12px]">
            <p className="text-[14px] font-[600] text-text-5">
              1일차 럭키드로우 마감
            </p>
            <p className="text-[12px] font-[400] text-text-4">25.08.26 11:30</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
