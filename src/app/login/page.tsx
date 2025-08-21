"use client";

import { getSignIn } from "@/apis/api";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import KakaoLogo from "@/svgs/KakaoLogo.svg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useUserStore from "../stores/userStore";

const Page = () => {
  const router = useRouter();
  const [inputEmail, setInputEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = (inputEmail: string) => {
    setInputEmail(inputEmail);
  };

  const handlePasswordChange = (password: string) => {
    setPassword(password);
  };

  // 이메일 유효성 검사
  const emailErrorMessage =
    inputEmail && !inputEmail.trim().toLowerCase().endsWith(".com")
      ? "메일 형식이 올바르지 않습니다"
      : "";

  const fetchSignInData = async () => {
    try {
      const data = await getSignIn(inputEmail, password);
      useUserStore.getState().setUser(data);
      router.push("/main");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleKakaoLogin = () => {
    router.push(
      "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a1c8f8ab77b2ad88da439427df5c5226&redirect_uri=http://localhost:3000/oauth/kakao"
    );
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center items-center">
      <div className="px-[24px] pt-[34px]">
        <h1 className="font-[700] text-text-5 text-[20px] pb-[40px]">
          반가워요👋
          <br />
          디어위드와 함께
          <br />
          생카를 즐겨볼까요?
        </h1>
        <Input
          _value={inputEmail}
          _state="textbox-underline"
          _title="이메일"
          _bottomNode={emailErrorMessage}
          _view
          _onChange={handleEmailChange}
        />
        <Input
          _value={password}
          _state="textbox-underline"
          _title="비밀번호"
          _bottomNode={emailErrorMessage}
          _view
          _onChange={handlePasswordChange}
        />
      </div>
      <Button
        _state="main"
        _node="로그인"
        _buttonProps={{ className: "hover:cursor-pointer" }}
        _onClick={fetchSignInData}
      />
      <div className="flex text-[12px] font-[400] gap-[16px]">
        <p>이메일 칮기</p>
        <p>|</p>
        <p>비밀번호 찾기</p>
        <p>|</p>
        <p>회원가입</p>
      </div>
      <div className="flex items-center">
        <hr className="h-[1px] w-[145.5px] text-divider-1" />
        <p className="text-[12px] font-[600]">또는</p>
        <hr className="h-[1px] w-[160.5px] text-divider-1" />
      </div>
      <Button
        _state="main"
        _node={<KakaoLogo />}
        _buttonProps={{
          className: "hover:cursor-pointer bg-[#FEE500] text-[#191919]",
        }}
        _onClick={handleKakaoLogin}
      />
    </div>
  );
};

export default Page;
