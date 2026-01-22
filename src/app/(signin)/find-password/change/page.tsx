"use client";

import { useState, Suspense } from "react";
import { AxiosError } from "axios";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Bottombar from "@/components/template/Bottombar";
import { resetPassword } from "@/apis/api";
import { useEmailTicketStore } from "@/app/stores/userStore";
import Backward from "@/svgs/Backward.svg";
import Topbar from "@/components/template/Topbar";
import ViewDefault from "@/svgs/ViewDefault.svg";
import ViewOn from "@/svgs/ViewOn.svg";
import useModalStore from "@/app/stores/useModalStore";

const ChangePasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const { openAlert } = useModalStore();
  const emailTicket = useEmailTicketStore((state) => state.emailTicket);

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
    if (!passwordRegex.test(newPassword)) {
      setPasswordError("영문, 숫자, 특수문자 포함 8자리 이상");
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!email || !emailTicket) {
      openAlert("인증 정보가 없습니다. 다시 시도해주세요.");
      router.push("/find-password");
      return;
    }

    try {
      await resetPassword(email, emailTicket, newPassword);

      openAlert("비밀번호가 변경되었어요. 다시 로그인 해주세요.");

      router.push("/login");
    } catch (error) {
      console.error("비밀번호 변경 에러:", error);
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "비밀번호 변경에 실패했습니다. 다시 시도해주세요.";
      setConfirmPasswordError(errorMessage);
      openAlert(errorMessage);
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
        _topNode="비밀번호 찾기"
      />

      <div className="px-[24px] pt-[30px]">
        <h1 className="typo-title2 text-text-5 mb-[20px]">
          새로운 비밀번호를 등록해주세요
        </h1>

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
            _node="비밀번호 변경하기"
            _buttonProps={{
              className: `hover:cursor-pointer ${!newPassword || !confirmPassword || passwordError || confirmPasswordError
                ? "opacity-50 cursor-not-allowed"
                : ""
                }`,
              disabled: !newPassword || !confirmPassword || !!passwordError || !!confirmPasswordError,
            }}
            _onClick={handleChangePassword}
          />
        }
      />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={
      <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center items-center h-screen">
        <div>로딩 중...</div>
      </div>
    }>
      <ChangePasswordContent />
    </Suspense>
  );
};

export default Page;

