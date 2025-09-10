import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Share from "@/svgs/Share.svg";
import HeartDefault from "@/svgs/HeartDefault.svg";
import Comment from "@/svgs/Comment.svg";
import Etc from "@/svgs/Etc.svg";

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

      <div className="mx-[24px] border-b-[0.8px] border-divider-1">
        <div className="flex justify-between w-full items-center my-[20px]">
          <div className="flex w-full">
            <div className="w-[36px] h-[36px] rounded-[50px] bg-primary" />
            <div className="flex flex-col pl-[12px]">
              <p className="text-text-5 font-[600] text-[14px]">
                도운이 바라기
              </p>
              <p className="text-text-2 font-[600] text-[12px]">2시간 전</p>
            </div>
          </div>
          <Etc />
        </div>

        <div className="flex gap-[8px]">
          <div className="w-[160px] h-[160px] bg-primary rounded-[4px]" />
          <div className="w-[160px] h-[160px] bg-primary rounded-[4px]" />
        </div>
        <p className="w-[327px] font-[400] text-[14px] text-text-5 leading-[165%] my-[12px]">
          오늘 생일카페 다녀왔는데 너무 예쁘고 굿즈도 완전 마음에 들어요!
          포토존도 잘 꾸며져 있고 특히 케이크가 정말 맛있었어요. 다시 또 가고
          싶네요..!
        </p>

        <div className="flex gap-[4px]">
          <div className="px-[6px] py-[2px] bg-[#FFE5AF] text-[#FD725C] text-[12px] font-[600] rounded-[4px] flex justify-center items-center">
            도운생일카페
          </div>
          <div className="px-[6px] py-[2px] bg-[#FFE5AF] text-[#FD725C] text-[12px] font-[600] rounded-[4px] flex justify-center items-center">
            성수카페
          </div>
          <div className="px-[6px] py-[2px] bg-[#FFE5AF] text-[#FD725C] text-[12px] font-[600] rounded-[4px] flex justify-center items-center">
            생일축하해
          </div>
          <div className="px-[6px] py-[2px] bg-[#FFE5AF] text-[#FD725C] text-[12px] font-[600] rounded-[4px] flex justify-center items-center">
            포토존맛집
          </div>
        </div>
        <div className="flex my-[20px] gap-[16px] text-text-3 font-[600] text-[12px] justify-start">
          <div className="flex gap-[2px] items-center">
            <HeartDefault stroke="#757575" />
            <p>32</p>
          </div>
          <div className="flex gap-[2px] items-center">
            <Comment stroke="#757575" />
            <p>12</p>
          </div>
          <Share stroke="#757575" />
        </div>
      </div>
    </div>
  );
};
export default Page;
