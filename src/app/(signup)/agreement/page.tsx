"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Backward from "@/svgs/Backward.svg";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import Bottombar from "@/components/template/Bottombar";
import Topbar from "@/components/template/Topbar";
import ProgressBar from "@/components/Progressbar/Progressbar";
import { useAgreementStore } from "@/app/stores/userStore";
import { postSocialSignUp } from "@/apis/api";
import useUserStore from "@/app/stores/userStore";
import useModalStore from "@/app/stores/useModalStore";

const SOCIAL_SIGNUP_KEY = "dearwith:socialSignUp";

const AgreementContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openAlert } = useModalStore();
  const [isSocialSignUp, setIsSocialSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(1);

  const agreementStore = useAgreementStore();
  const [checkedItems, setCheckedItems] = useState({
    item1: agreementStore.item1,
    item2: agreementStore.item2,
    item3: agreementStore.item3,
    item4: false,
    item5: agreementStore.item5,
  });

  useEffect(() => {
    // 소셜 회원가입인지 확인
    const provider = searchParams?.get("provider");
    const socialId = searchParams?.get("socialId");
    
    if (provider && socialId) {
      try {
        sessionStorage.setItem(
          SOCIAL_SIGNUP_KEY,
          JSON.stringify({ provider, socialId })
        );
        setIsSocialSignUp(true);
      } catch {}
    } else {
      // sessionStorage에서 확인
      try {
        const stored = sessionStorage.getItem(SOCIAL_SIGNUP_KEY);
        if (stored) {
          setIsSocialSignUp(true);
        }
      } catch {}
    }
  }, [searchParams]);

  const allChecked = Object.values(checkedItems).every(Boolean);

  const handleItemChange = (
    key: keyof typeof checkedItems,
    checked: boolean
  ) => {
    setCheckedItems((prev) => ({ ...prev, [key]: checked }));
  };

  const handleAllChange = (checked: boolean) => {
    const newState: typeof checkedItems = {
      item1: checked,
      item2: checked,
      item3: checked,
      item4: checked,
      item5: checked,
    };
    setCheckedItems(newState);
  };

  const fetchAgreeData = async () => {
    // agreement 체크 상태를 스토어에 저장
    agreementStore.setAgreements({
      item1: checkedItems.item1,
      item2: checkedItems.item2,
      item3: checkedItems.item3,
      item5: checkedItems.item5,
    });
    
    if (isSocialSignUp) {
      // 소셜 회원가입이면 바로 회원가입 API 호출
      try {
        setIsSubmitting(true);
        
        // sessionStorage에서 소셜 회원가입 정보 가져오기
        let socialSignUpData: { provider: "KAKAO" | "APPLE"; socialId: string } | null = null;
        try {
          const stored = sessionStorage.getItem(SOCIAL_SIGNUP_KEY);
          if (stored) {
            const data = JSON.parse(stored);
            socialSignUpData = {
              provider: data.provider === "APPLE" ? "APPLE" : "KAKAO",
              socialId: data.socialId,
            };
          }
        } catch {}

        if (!socialSignUpData) {
          openAlert("소셜 회원가입 정보를 찾을 수 없습니다.");
          return;
        }

        // 소셜 회원가입 API 호출 (닉네임은 빈 문자열)
        const signupResponse = await postSocialSignUp(
          socialSignUpData.provider,
          socialSignUpData.socialId,
          "", // 닉네임은 빈 문자열로 전달
          [
            { type: "AGE_OVER_14", agreed: checkedItems.item1 },
            { type: "TERMS_OF_SERVICE", agreed: checkedItems.item2 },
            { type: "PERSONAL_INFORMATION", agreed: checkedItems.item3 },
            { type: "PUSH_NOTIFICATION", agreed: checkedItems.item5 },
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
          nickname: nickname || "",
          role,
        });

        setCurrentStep((prev) => Math.min(prev + 1, 6));
        
        // 닉네임이 없으면 set-nickname으로, 있으면 signup-complete로
        if (!nickname) {
          router.push("/set-nickname");
        } else {
          router.push("/signup-complete");
        }
      } catch (error) {
        console.error("소셜 회원가입 에러:", error);
        openAlert("회원가입 요청에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // 일반 회원가입이면 이메일 발송 페이지로 이동
      router.push("/mail-send");
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar _leftImage={<button onClick={() => router.back()}><Backward /></button>} _topNode="제목" />
      <div className="px-[24px] pt-[30px]">
        <h2 className="font-[700] text-text-5 text-[20px] pb-[20px]">
          디어위드와 함께하기 위해
          <br />
          약관동의가 필요해요
        </h2>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <Checkbox
          _id="selectAll"
          _value="모두 동의하기 (선택 항목 포함)"
          _type="neutral1100"
          _checked={allChecked}
          _onChange={handleAllChange}
          _inputWrapperProps={{
            className: "text-text-5 text-[16px] font-[600]",
          }}
        />
        <div className="h-[1px] w-full bg-divider-1 mt-[12px] mb-[16px]" />
        <Checkbox
          _id="item1"
          _value="[필수] 만 14세 이상입니다."
          _type="icon2"
          _checked={checkedItems.item1}
          _onChange={(checked) => handleItemChange("item1", checked)}
        />
        <Checkbox
          _id="item2"
          _value="[필수] 서비스 이용 약관 동의"
          _type="icon2"
          _checked={checkedItems.item2}
          _onChange={(checked) => handleItemChange("item2", checked)}
        />
        <Checkbox
          _id="item3"
          _value="[필수] 개인정보 수집 및 이용 동의"
          _type="icon2"
          _checked={checkedItems.item3}
          _onChange={(checked) => handleItemChange("item3", checked)}
        />
        <Checkbox
          _id="item4"
          _value="[선택] 마케팅 개인정보 제3자 제공 동의"
          _type="icon2"
          _checked={checkedItems.item4}
          _onChange={(checked) => handleItemChange("item4", checked)}
        />
        <Checkbox
          _id="item5"
          _value="[선택] PUSH 알림 동의"
          _type="icon2"
          _checked={checkedItems.item5}
          _onChange={(checked) => handleItemChange("item5", checked)}
        />
      </div>

      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="동의하고 진행하기"
            _buttonProps={{
              className: `hover:cursor-pointer ${
                !(
                  checkedItems.item1 &&
                  checkedItems.item2 &&
                  checkedItems.item3
                )
                  ? "opacity-50 cursor-not-allowed w-full"
                  : ""
              }`,
              disabled: !(
                checkedItems.item1 &&
                checkedItems.item2 &&
                checkedItems.item3
              ) || isSubmitting,
            }}
            _onClick={fetchAgreeData}
          />
        }
      />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgreementContent />
    </Suspense>
  );
};

export default Page;
