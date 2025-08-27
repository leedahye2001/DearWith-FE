"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePasswordStore } from "@/app/stores/userStore";
import ProgressBar from "@/components/ProgressBar/ProgressBar";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Input from "@/components/Input/Input";
import ViewDefault from "@/svgs/ViewDefault.svg";
import ViewOn from "@/svgs/ViewOn.svg";
import Check from "@/svgs/Check.svg";
import Bottombar from "@/components/template/Bottombar";
import Button from "@/components/Button/Button";

const Page = () => {
  const router = useRouter();

  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(4);

  const password = usePasswordStore((state) => state.password);
  const setPassword = usePasswordStore((state) => state.setPassword);

  const [matchPassword, setMatchPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMatchPassword, setShowMatchPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 비밀번호 토글
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleMatchPassword = () => setShowMatchPassword((prev) => !prev);

  // 비밀번호 유효성 검사
  const validatePassword = (value: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~])[A-Za-z\d!@#$%^&*()_\-+=<>?{}[\]~]{8,}$/;
    if (!regex.test(value)) {
      return "영문, 숫자, 특수문자 포함 8자리 이상 입력해주세요";
    }
    return "";
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrorMessage(validatePassword(value));
  };

  const handleMatchPasswordChange = (value: string) => {
    setMatchPassword(value);
  };

  const fetchMailData = async () => {
    try {
      // await getMailSignUp(inputEmail, password, nickname);
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      router.push("/mail-nickname");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 유효성 체크
  const isPasswordValid = password && errorMessage === "";
  const isMatchValid = password === matchPassword && matchPassword !== "";
  const isFormValid = isPasswordValid && isMatchValid;

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar _leftImage={<Backward />} _topNode="제목" />
      <div className="px-[24px] pt-[30px]">
        <h1 className="font-[700] text-text-5 text-[20px] pb-[20px]">
          디어위드에서 사용할
          <br />
          비밀번호를 입력해주세요
        </h1>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {/* 비밀번호 입력 */}
        <Input
          _value={password}
          _state="textbox-basic"
          _title="비밀번호"
          _bottomNode={isPasswordValid ? "" : errorMessage}
          _inputProps={{
            type: showPassword ? "text" : "password",
          }}
          _rightNode={
            <div className="flex items-center gap-1">
              <button type="button" onClick={togglePassword}>
                {showPassword ? <ViewOn /> : <ViewDefault />}
              </button>
              {isPasswordValid && <Check />}
            </div>
          }
          _onChange={handlePasswordChange}
          _containerProps={{ className: "pt-[16px]" }}
        />

        {/* 비밀번호 확인 */}
        <Input
          _value={matchPassword}
          _state="textbox-basic"
          _title="비밀번호 확인"
          _bottomNode={
            matchPassword && !isMatchValid
              ? "입력하신 비밀번호가 일치하지 않습니다"
              : ""
          }
          _inputProps={{
            type: showMatchPassword ? "text" : "password",
          }}
          _rightNode={
            <div className="flex items-center gap-1">
              <button type="button" onClick={toggleMatchPassword}>
                {showMatchPassword ? <ViewOn /> : <ViewDefault />}
              </button>
              {isMatchValid && <Check />}
            </div>
          }
          _onChange={handleMatchPasswordChange}
          _containerProps={{ className: "pt-[16px]" }}
        />
      </div>

      {/* 하단 버튼 */}
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="비밀번호 등록하기"
            _buttonProps={{
              className: `hover:cursor-pointer ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
              }`,
              disabled: !isFormValid,
            }}
            _onClick={fetchMailData}
          />
        }
      />
    </div>
  );
};

export default Page;
