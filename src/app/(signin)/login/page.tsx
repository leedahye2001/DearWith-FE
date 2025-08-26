"use client";

import { getSignIn } from "@/apis/api";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import KakaoLogo from "@/svgs/KakaoLogo.svg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useUserStore from "../../stores/userStore";
import ViewDefault from "@/svgs/ViewDefault.svg";
import ViewOn from "@/svgs/ViewOn.svg";

const Page = () => {
  const router = useRouter();
  const [inputEmail, setInputEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 토글
  const togglePassword = () => setShowPassword((prev) => !prev);

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

  const handleSignup = () => {
    router.push("/agreement");
  };

  const handleKakaoLogin = () => {
    router.push(
      "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a1c8f8ab77b2ad88da439427df5c5226&redirect_uri=http://localhost:3000/oauth/kakao"
    );
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center items-center px-[24px] pt-[34px]">
      <h1 className="w-full text-left font-[700] text-text-5 text-[20px] pb-[40px]">
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
        _onChange={handleEmailChange}
        _containerProps={{ className: "pb-[20px]" }}
      />
      <Input
        _value={password}
        _state="textbox-underline"
        _title="비밀번호"
        _onChange={handlePasswordChange}
        _inputProps={{
          type: showPassword ? "text" : "password",
        }}
        _rightNode={
          <button type="button" onClick={togglePassword}>
            {showPassword ? <ViewOn /> : <ViewDefault />}
          </button>
        }
        _containerProps={{ className: "pb-[55px]" }}
      />

      <Button
        _state="main"
        _node="로그인"
        _buttonProps={{ className: "hover:cursor-pointer mb-[12px]" }}
        _onClick={fetchSignInData}
      />
      <div className="flex text-[12px] font-[400] gap-[16px]">
        <p>이메일 칮기</p>
        <p>|</p>
        <p>비밀번호 찾기</p>
        <p>|</p>
        <p onClick={handleSignup}>회원가입</p>
      </div>

      <div className="flex items-center pt-[40px] pb-[12px] w-full">
        <div className="flex-grow h-[1px] bg-divider-1" />
        <p className="text-[12px] font-[600] px-[10px] whitespace-nowrap">
          또는
        </p>
        <div className="flex-grow h-[1px] bg-divider-1" />
      </div>

      <Button
        _state="main"
        _node={
          <div className="flex justify-between items-center p-[10px]">
            <KakaoLogo />
            <span className="text-[#191919] text-[14px] font-[600]">
              카카오로 시작하기
            </span>
            <div className="w-[18px]" />
          </div>
        }
        _buttonProps={{
          className: "hover:cursor-pointer bg-[#FEE500] text-[#191919]",
        }}
        _onClick={handleKakaoLogin}
      />
    </div>
  );
};

export default Page;
