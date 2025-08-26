"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEmailStore } from "@/app/stores/userStore";
import { getMailSend } from "@/apis/api";
import Check from "@/svgs/Check.svg";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Bottombar from "@/components/template/Bottombar";
import ProgressBar from "@/components/ProgressBar/ProgressBar";

const Page = () => {
  const router = useRouter();
  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(2);

  const inputEmail = useEmailStore((state) => state.inputEmail);
  const setInputEmail = useEmailStore((state) => state.setInputEmail);

  const handleEmailSendChange = (inputEmail: string) => {
    setInputEmail(inputEmail);
  };

  // 이메일 유효성 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailErrorMessage =
    inputEmail && !emailRegex.test(inputEmail.trim().toLowerCase())
      ? "메일 형식이 올바르지 않습니다"
      : "";

  const fetchMailData = async () => {
    try {
      await getMailSend(inputEmail);
      router.push("/mail-verify");
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar _leftImage={<Backward />} _topNode="제목" />
      <div className="px-[24px] pt-[30px]">
        <h1 className="font-[700] text-text-5 text-[20px] pb-[20px]">
          디어위드에서 사용할 <br />
          이메일을 입력해 주세요
        </h1>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <Input
          _value={inputEmail}
          _state="textbox-underline"
          _title="이메일"
          _bottomNode={emailErrorMessage}
          _rightNode={inputEmail && !emailErrorMessage ? <Check /> : null}
          _onChange={handleEmailSendChange}
        />
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="이메일 인증 요청하기"
            _buttonProps={{
              className: `hover:cursor-pointer ${
                !inputEmail || emailErrorMessage
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`,
              disabled: !inputEmail || !!emailErrorMessage,
            }}
            _onClick={fetchMailData}
          />
        }
      />
    </div>
  );
};

export default Page;
