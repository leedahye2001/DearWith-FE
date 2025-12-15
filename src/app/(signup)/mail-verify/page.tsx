"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMailVerify, getMailSend } from "@/apis/api";
import { useEmailStore } from "@/app/stores/userStore";
import Button from "@/components/Button/Button";
import Bottombar from "@/components/template/Bottombar";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Input from "@/components/Input/Input";
import Countdown from "@/utils/Countdown";
import ProgressBar from "@/components/Progressbar/Progressbar";

const Page = () => {
  const router = useRouter();

  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(3);

  const inputEmail = useEmailStore((state) => state.inputEmail);
  // const setInputEmail = useEmailStore((state) => state.setInputEmail);

  const [code, setCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resendKey, setResendKey] = useState<number>(0);

  const handleCodeChange = (code: string) => {
    setCode(code);
    if (errorMessage) setErrorMessage("");
  };

  const fetchMailData = async () => {
    try {
      await getMailVerify(inputEmail, code);
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      router.push("/mail-signup");
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("인증번호가 올바르지 않습니다");
    }
  };

  const handleResend = async () => {
    try {
      if (!inputEmail) {
        // alert("이메일을 먼저 입력해주세요.");
        return;
      }
      await getMailSend(inputEmail);
      // alert("인증 메일이 재전송되었습니다.");
      setResendKey((prev) => prev + 1);
    } catch (error) {
      console.error("재전송 에러:", error);
      alert("이메일 재전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar _leftImage={<button onClick={() => router.back()}><Backward /></button>} _topNode="제목" />
      <div className="px-[24px] pt-[30px]">
        <h1 className="font-[700] text-text-5 text-[20px]">
          이메일 인증을 완료해주세요
        </h1>
        <p className="text-text-4 font-[400] text-[14px] pb-[20px]">
          아래 이메일로 보내드린 인증 코드를 입력해 주세요.
        </p>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        {inputEmail ? (
          <div className="flex justify-center items-center rounded-[4px] w-full min-h-[44px] bg-[#FFF3D7] text-[16px] font-[600] py-[12px]">
            {inputEmail}
          </div>
        ) : (
          <div className="flex justify-center items-center rounded-[4px] w-full min-h-[44px] bg-[#FFF3D7] text-[16px] font-[600] py-[12px]">
            이메일을 다시 입력해주세요.
          </div>
        )}

        <Input
          _value={code}
          _state="textbox-basic"
          _title="인증코드"
          _bottomNode={errorMessage}
          _rightNode={
            <div className="flex items-center gap-[8px]">
              <Countdown key={resendKey} minutes={10} />
              <Button _state="sub" _node="재전송" _onClick={handleResend} />
            </div>
          }
          _onChange={handleCodeChange}
          _containerProps={{ className: "pt-[16px]" }}
        />

        <div className="h-[1px] wu-full bg-divider-1 mt-[16px] mb-[8px]" />
        <p className="text-text-2 text-[12px] font-[600]">
          입력하신 이메일로 인증 코드를 받지 못하셨다면
          <br /> 인증 코드 재전송 요청을 하거나 스팸 메일을 확인해주세요.
        </p>
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="이메일 인증 완료하기"
            _buttonProps={{
              className: `hover:cursor-pointer ${
                !code ? "opacity-50 cursor-not-allowed" : ""
              }`,
              disabled: !code,
            }}
            _onClick={fetchMailData}
          />
        }
      />
    </div>
  );
};

export default Page;
