"use client";

import { useState } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import Bottombar from "@/components/template/Bottombar";
import { getPasswordConfirm, postLogout } from "@/apis/api";
import Backward from "@/svgs/Backward.svg";
import Topbar from "@/components/template/Topbar";
import WriteTitle from "@/app/(events)/event-detail/components/WriteTitle";
import ViewDefault from "@/svgs/ViewDefault.svg";
import ViewOn from "@/svgs/ViewOn.svg";
import useModalStore from "@/app/stores/useModalStore";
import useUserStore, { useAuthStore } from "@/app/stores/userStore";
import ProgressBar from "@/components/Progressbar/Progressbar";
import { AxiosError } from "axios";

const Page = () => {
  const router = useRouter();
  const totalSteps = 2;
  const [currentStep] = useState(2);
  const { openAlert } = useModalStore();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passwordError, setPasswordError] = useState(
    "영문, 숫자, 특수문자 포함 8자리 이상"
  );

  const [confirmPasswordError, setConfirmPasswordError] = useState(
    "영문, 숫자, 특수문자 포함 8자리 이상"
  );

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);

    if (passwordRegex.test(value)) {
      setPasswordError("");
    } else {
      setPasswordError("영문, 숫자, 특수문자 포함 8자리 이상");
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    if (value === newPassword && passwordRegex.test(value)) {
      setConfirmPasswordError("");
    } else {
      setConfirmPasswordError("비밀번호를 다시 입력해주세요.");
    }
  };

  const handleChangePassword = async () => {
    try {
      await getPasswordConfirm(newPassword);

      // 로그아웃 처리 (서버 쿠키 삭제)
      try {
        await postLogout();
      } catch (logoutError) {
        console.error("로그아웃 에러:", logoutError);
        // 로그아웃 실패해도 계속 진행 (클라이언트 쿠키 삭제는 계속 진행)
      }

      // 클라이언트 저장소 정리
      localStorage.clear();
      useUserStore.getState().clearUser();
      useAuthStore.getState().clearTokens(); // 쿠키에 저장된 토큰 삭제

      openAlert("비밀번호가 변경되었어요. 다시 로그인 해주세요.");
      router.replace("/login");

    } catch (error){
      console.error("비밀번호 변경 에러:", error);
      const axiosError = error as AxiosError<{ code?: string; message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "비밀번호 변경에 실패했습니다. 다시 시도해주세요.";
      setConfirmPasswordError(errorMessage);
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
          id={2}
          question="새로운 비밀번호를 등록해주세요"
          questionClassName="text-[16px]"
          wrapperClassName="mb-[20px]"
        />

        <Input
          _value={newPassword}
          _state="textbox-basic"
          _title="새로운 비밀번호"
          _onChange={handleNewPasswordChange}
          _inputProps={{
            type: showPassword ? "text" : "password",
            placeholder: "비밀번호를 입력해주세요.",
            className: "placeholder:text-text-3 typo-body2 text-text-5",
         
          }}
          _rightNode={
            <button type="button" onClick={togglePassword}>
              {showPassword ? <ViewOn /> : <ViewDefault />}
            </button>
          }
          _containerProps={{ className: "pb-[20px]" }}
          _bottomNode={passwordError}
        />

        <Input
          _value={confirmPassword}
          _state="textbox-basic"
          _title="비밀번호 확인"
          _onChange={handleConfirmPasswordChange}
          _inputProps={{
            type: showPassword ? "text" : "password",
            placeholder: "비밀번호를 입력해주세요.",
            className: "placeholder:text-text-3 typo-body2 text-text-5",
         
          }}
          _rightNode={
            <button type="button" onClick={togglePassword}>
              {showPassword ? <ViewOn /> : <ViewDefault />}
            </button>
          }
          _bottomNode={confirmPasswordError}
        />
      </div>

      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="변경하기"
            _buttonProps={{ className: "hover:cursor-pointer" }}
            _onClick={handleChangePassword}
          />
        }
      />
    </div>
  );
};

export default Page;
