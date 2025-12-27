"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useCallback, Suspense } from "react";
import { AxiosError } from "axios";
import { getPasswordFindMailVerify, getPasswordFindMailSend } from "@/apis/api";
import { useEmailTicketStore } from "@/app/stores/userStore";
import Button from "@/components/Button/Button";
import Bottombar from "@/components/template/Bottombar";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Input from "@/components/Input/Input";
import Countdown from "@/utils/Countdown";
import useModalStore from "@/app/stores/useModalStore";

const VerifyContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "";
  const { openAlert } = useModalStore();
  const setEmailTicket = useEmailTicketStore((state) => state.setEmailTicket);

  const [code, setCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resendKey, setResendKey] = useState<number>(0);

  const handleCodeChange = (code: string) => {
    setCode(code);
    if (errorMessage) setErrorMessage("");
  };

  const fetchMailData = async () => {
    try {
      const res = await getPasswordFindMailVerify(email, code);
      // ticket을 스토어에 저장
      if (res.ticket) {
        setEmailTicket(res.ticket);
      }
      openAlert("이메일 인증이 완료되었습니다.");
      router.push(`/find-password/change?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error fetching data:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError?.response?.data?.message || "인증에 실패했습니다.";
      setErrorMessage(errorMessage);
      openAlert(errorMessage);
    }
  };

  const handleResend = useCallback(async () => {
    try {
      if (!email) {
        openAlert("이메일을 먼저 입력해주세요.");
        return;
      }
      await getPasswordFindMailSend(email);
      openAlert("인증 메일이 재전송되었습니다.");
      setResendKey((prev) => prev + 1);
    } catch (error) {
      console.error("재전송 에러:", error);
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "이메일 재전송에 실패했습니다. 다시 시도해주세요.";
      openAlert(errorMessage);
    }
  }, [email, openAlert]);

  const rightNode = useMemo(
    () => (
      <div className="flex items-center gap-[8px] flex-shrink-0">
        <div className="flex-shrink-0">
          <Countdown key={resendKey} minutes={10} />
        </div>
        <div className="flex-shrink-0">
          <Button _state="sub" _node="재전송" _onClick={handleResend} />
        </div>
      </div>
    ),
    [resendKey, handleResend]
  );

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar 
        _leftImage={<button onClick={() => router.back()}><Backward /></button>} 
        _topNode="비밀번호 찾기" 
      />
      <div className="px-[24px] pt-[30px]">
        <h1 className="font-[700] text-text-5 text-[20px]">
          이메일 인증을 완료해주세요
        </h1>
        <p className="text-text-4 font-[400] text-[14px] pb-[20px]">
          아래 이메일로 보내드린 인증 코드를 입력해 주세요.
        </p>
        {email ? (
          <div className="flex justify-center items-center rounded-[4px] w-full min-h-[44px] bg-[#FFF3D7] text-[16px] font-[600] py-[12px]">
            {email}
          </div>
        ) : (
          <div className="flex justify-center items-center rounded-[4px] w-full min-h-[44px] bg-[#FFF3D7] text-[16px] font-[600] py-[12px]">
            이메일을 다시 입력해주세요.
          </div>
        )}

        <Input
          _value={code}
          _state="textbox-basic"
          _title="인증코드"
          _bottomNode={errorMessage}
          _rightNode={rightNode}
          _onChange={handleCodeChange}
          _containerProps={{ className: "pt-[16px]" }}
        />

        <div className="h-[1px] w-full bg-divider-1 mt-[16px] mb-[8px]" />
        <p className="text-text-2 text-[12px] font-[500]">
          입력하신 이메일로 인증 코드를 받지 못하셨다면
          <br /> 인증 코드 재전송 요청을 하거나 스팸 메일을 확인해주세요.
        </p>
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="이메일 인증 완료하기"
            _buttonProps={{
              className: `hover:cursor-pointer ${
                !code ? "opacity-50 cursor-not-allowed" : ""
              }`,
              disabled: !code,
            }}
            _onClick={fetchMailData}
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
      <VerifyContent />
    </Suspense>
  );
};

export default Page;

