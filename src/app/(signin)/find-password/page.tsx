"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { getPasswordFindMailSend } from "@/apis/api";
import Check from "@/svgs/Check.svg";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Bottombar from "@/components/template/Bottombar";
import useModalStore from "@/app/stores/useModalStore";

const Page = () => {
  const router = useRouter();
  const { openAlert } = useModalStore();
  const [inputEmail, setInputEmail] = useState("");

  const handleEmailSendChange = (email: string) => {
    setInputEmail(email);
  };

  // 이메일 유효성 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailErrorMessage =
    inputEmail && !emailRegex.test(inputEmail.trim().toLowerCase())
      ? "메일 형식이 올바르지 않습니다"
      : "";

  const fetchMailData = async () => {
    try {
      await getPasswordFindMailSend(inputEmail);
      openAlert("인증 메일이 발송되었습니다.");
      router.push(`/find-password/verify?email=${encodeURIComponent(inputEmail)}`);
    } catch (error) {
      console.error("Error fetching data:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError?.response?.data?.message || "이메일 발송에 실패했습니다.";
      openAlert(errorMessage);
    }
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar 
        _leftImage={<button onClick={() => router.back()}><Backward /></button>} 
        _topNode="비밀번호 찾기" 
      />
      <div className="px-[24px] pt-[30px]">
        <h1 className="font-[700] text-text-5 text-[20px] pb-[20px]">
          비밀번호를 찾기 위해
          <br />
          이메일을 입력해 주세요
        </h1>
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

