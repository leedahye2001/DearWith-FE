"use client";

import { useState, useEffect } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import Check from "@/svgs/Check.svg";
import Bottombar from "@/components/template/Bottombar";
import { getNicknameCheck, postSocialSignUp } from "@/apis/api";
import { useNicknameStore, useAgreementStore } from "@/app/stores/userStore";
import Backward from "@/svgs/Backward.svg";
import Topbar from "@/components/template/Topbar";
import ProgressBar from "@/components/Progressbar/Progressbar";
import useModalStore from "@/app/stores/useModalStore";
import useUserStore from "@/app/stores/userStore";
import { AxiosError } from "axios";

const SOCIAL_SIGNUP_KEY = "dearwith:socialSignUp";

const Page = () => {
  const router = useRouter();
  const { openAlert } = useModalStore();
  const setNickname = useNicknameStore((state) => state.setNickname);

  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(5);
  const [inputNickname, setInputNickname] = useState<string>("");
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState("");
  const [socialSignUpData, setSocialSignUpData] = useState<{
    provider: "KAKAO" | "APPLE";
    socialId: string;
  } | null>(null);

  const agreementStore = useAgreementStore();
  const item1 = agreementStore.item1;
  const item2 = agreementStore.item2;
  const item3 = agreementStore.item3;
  const item5 = agreementStore.item5;

  useEffect(() => {
    // sessionStorage에서 소셜 회원가입 정보 가져오기
    try {
      const stored = sessionStorage.getItem(SOCIAL_SIGNUP_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setSocialSignUpData({
          provider: data.provider === "APPLE" ? "APPLE" : "KAKAO",
          socialId: data.socialId,
        });
      } else {
        // 소셜 회원가입 정보가 없으면 메인으로 이동
        router.push("/main");
      }
    } catch {
      router.push("/main");
    }
  }, [router]);

  const handleNicknameChange = (value: string) => {
    setInputNickname(value);

    // 입력 시 기본 유효성 검사
    if (!/^[a-zA-Z0-9가-힣]{2,8}$/.test(value)) {
      setNicknameErrorMessage("영문, 한글, 숫자 중 2-8자리");
    } else {
      setNicknameErrorMessage("");
    }
  };

  const isNicknameValid =
    inputNickname && /^[a-zA-Z0-9가-힣]{2,8}$/.test(inputNickname);

  const fetchNicknameCheckData = async () => {
    if (!socialSignUpData) {
      openAlert("소셜 회원가입 정보를 찾을 수 없습니다.");
      return;
    }

    // 닉네임 유효성 검사
    if (!inputNickname || !inputNickname.trim() || !isNicknameValid) {
      setNicknameErrorMessage("닉네임을 올바르게 입력해주세요.");
      return;
    }

    const trimmedNickname = inputNickname.trim();

    try {
      // 닉네임 중복 확인
      const checkData = await getNicknameCheck(trimmedNickname);
      if (checkData.isAvailable === false) {
        setNicknameErrorMessage("이미 존재하는 닉네임입니다.");
        return;
      }

      // 소셜 회원가입 API 호출
      const signupResponse = await postSocialSignUp(
        socialSignUpData.provider,
        socialSignUpData.socialId,
        trimmedNickname,
        [
          { type: "AGE_OVER_14", agreed: item1 },
          { type: "TERMS_OF_SERVICE", agreed: item2 },
          { type: "PERSONAL_INFORMATION", agreed: item3 },
          { type: "PUSH_NOTIFICATION", agreed: item5 },
        ]
      );

      // sessionStorage에서 소셜 회원가입 정보 제거
      try {
        sessionStorage.removeItem(SOCIAL_SIGNUP_KEY);
      } catch {}

      // 사용자 정보 저장
      const { userId, role, nickname } = signupResponse;
      useUserStore.getState().setUser({
        message: "",
        userId,
        nickname: nickname || trimmedNickname,
        role,
      });

      setNickname(trimmedNickname);
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      router.push("/signup-complete");
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "";
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
        _topNode=""
      />
      <div className="px-[24px] pt-[30px]">
        <h1 className="font-[700] text-text-5 text-[20px] pb-[20px]">
          디어위드에서 사용할 <br />
          닉네임을 입력해 주세요
        </h1>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <Input
          _value={inputNickname}
          _state="textbox-basic"
          _title="닉네임"
          _bottomNode={nicknameErrorMessage}
          _rightNode={isNicknameValid ? <Check /> : null}
          _onChange={handleNicknameChange}
        />
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="닉네임 등록하기"
            _buttonProps={{
              className: `hover:cursor-pointer ${
                !isNicknameValid ? "opacity-50 cursor-not-allowed" : ""
              }`,
              disabled: !isNicknameValid,
            }}
            _onClick={fetchNicknameCheckData}
          />
        }
      />
    </div>
  );
};

export default Page;

