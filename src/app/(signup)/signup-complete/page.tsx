"use client";

import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import Bottombar from "@/components/template/Bottombar";
import Backward from "@/svgs/Backward.svg";
import Topbar from "@/components/template/Topbar";
import GuideSection from "./components/GuideSection";
import { useNicknameStore } from "@/app/stores/userStore";
import ProgressBar from "@/components/Progressbar/Progressbar";

const Page = () => {
  const router = useRouter();
  const nickname = useNicknameStore((state) => state.nickname);

  const totalSteps = 6;

  const fetchSigninData = async () => {
    router.push("/login");
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar _leftImage={<button onClick={() => router.back()}><Backward /></button>} _topNode="" />
      <div className="px-[24px] pt-[30px]">
        {nickname && nickname ? (
          <h1 className="font-[700] text-text-5 text-[20px]">
            {nickname} 님,
            <br />
            회원가입이 완료되었어요
          </h1>
        ) : (
          <h1 className="font-[700] text-text-5 text-[20px]">
            디어위드님,
            <br />
            회원가입이 완료되었어요
          </h1>
        )}
        <p className="text-text-4 font-[400] text-[14px] pb-[23px]">
          디어위드에서 다양한 이벤트를 확인해 보세요!
        </p>
        <ProgressBar
          currentStep={6}
          totalSteps={totalSteps}
          className="mb-[23px]"
        />
        <GuideSection
          id={1}
          question={"주최할 이벤트를 알리고 싶다면?"}
          answer={
            <>
              이벤트를 주최하실 예정인가요? <br />
              디어위드에서 많은 사람들에게 주최하는 이벤트를 알려보세요.
            </>
          }
        />
        <GuideSection
          id={2}
          question={"참여하고 싶은 이벤트가 있다면?"}
          answer={
            <>
              다양한 이벤트 중 내가 참여하고 싶은 이벤트를
              <br /> 나만의 리스트에 추가하여 참여해 보세요.
            </>
          }
        />
        <GuideSection
          id={3}
          question={"다양한 정보를 공유하고 싶다면?"}
          answer={
            <>커뮤니티를 통해 사람들에게 다양한 정보를 공유해 보세요.</>
          }
        />
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="로그인 하러 가기"
            _buttonProps={{
              className: "hover:cursor-pointer",
            }}
            _onClick={fetchSigninData}
          />
        }
      />
    </div>
  );
};

export default Page;
