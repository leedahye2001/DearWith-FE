"use client";

import { useState } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import Bottombar from "@/components/template/Bottombar";
import { getPasswordVerify } from "@/apis/api";
import Backward from "@/svgs/Backward.svg";
import Topbar from "@/components/template/Topbar";
import WriteTitle from "@/app/(events)/event-detail/components/WriteTitle";
import ViewDefault from "@/svgs/ViewDefault.svg";
import ViewOn from "@/svgs/ViewOn.svg";
import ProgressBar from "@/components/ProgressBar/ProgressBar";

const Page = () => {
  const router = useRouter();
  const totalSteps = 2;
  const [currentStep, setCurrentStep] = useState(1);

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(
    "영문, 숫자, 특수문자 포함 8자리 이상"
  );

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (passwordRegex.test(value)) {
      setIsPasswordValid("");
    } else {
      setIsPasswordValid("영문, 숫자, 특수문자 포함 8자리 이상");
    }
  };

  const handleVerifyPassword = async () => {
    try {
      await getPasswordVerify(password);

      setCurrentStep((prev) => Math.min(prev + 1, 6));
      router.push("/change-password");
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsPasswordValid("비밀번호를 다시 입력해주세요.");
    }
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar
        _leftImage={
          <button onClick={() => router.back()}>
            <Backward />
          </button>
        }
        _topNode="비밀번호 변경"
      />
      <div className="px-[24px] pt-[30px]">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <WriteTitle
          id={1}
          question={"기존 비밀번호를 입력해주세요"}
          questionClassName="text-[16px]"
          wrapperClassName="mb-[20px]"
        />

        <Input
          _value={password}
          _state="textbox-basic"
          _title="기존 비밀번호"
          _onChange={handlePasswordChange}
          _inputProps={{
            type: showPassword ? "text" : "password",
          }}
          _rightNode={
            <button type="button" onClick={togglePassword}>
              {showPassword ? <ViewOn /> : <ViewDefault />}
            </button>
          }
          _bottomNode={isPasswordValid}
        />
      </div>

      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="다음"
            _buttonProps={{ className: "hover:cursor-pointer" }}
            _onClick={handleVerifyPassword}
          />
        }
      />
    </div>
  );
};

export default Page;
