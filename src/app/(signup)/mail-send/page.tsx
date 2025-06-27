"use client";

import { useState } from "react";
import { getMailSend } from "@/apis/api";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Bottombar from "@/components/template/Bottombar";
import useUserStore from "@/app/stores/userStore";

const Page = () => {
  const router = useRouter();
  const validateCode = localStorage.getItem("validateCode");
  const { setEmail } = useUserStore();
  const [inputEmail, setInputEmail] = useState<string>("");

  const handleEmailSendChange = (inputEmail: string) => {
    setInputEmail(inputEmail);
  };

  console.log(validateCode);

  // 이메일 유효성 검사
  const emailErrorMessage =
    inputEmail && !inputEmail.trim().toLowerCase().endsWith(".com")
      ? "메일 형식이 올바르지 않습니다"
      : "";

  const fetchMailData = async () => {
    try {
      await getMailSend(inputEmail);
      setEmail(inputEmail);
      alert(
        "이메일로 코드가 전송되었습니다. 전송된 인증 코드를 아래에 입력해주세요."
      );
      router.push("/mail-verify");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar _leftImage={<Backward />} _topNode="제목" />
      <div className="px-[24px] pt-[34px]">
        <h1 className="font-[700] text-text-5 text-[20px] pb-[40px]">
          디어위드에서 사용할 <br />
          이메일을 입력해 주세요
        </h1>
        <Input
          _value={inputEmail}
          _state="textbox-underline"
          _title="이메일"
          _bottomNode={emailErrorMessage}
          _view
          _onChange={handleEmailSendChange}
        />
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="이메일 인증 요청하기"
            _buttonProps={{ className: "hover:cursor-pointer" }}
            _onClick={fetchMailData}
          />
        }
      />
    </div>
  );
};

export default Page;
