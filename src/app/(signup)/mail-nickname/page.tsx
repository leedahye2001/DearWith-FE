"use client";

import { useState } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import Check from "@/svgs/Check.svg";
import Bottombar from "@/components/template/Bottombar";
import { getMailSignUp, getNicknameCheck } from "@/apis/api";
import {
  useEmailStore,
  useNicknameStore,
  usePasswordStore,
} from "@/app/stores/userStore";
import Backward from "@/svgs/Backward.svg";
import Topbar from "@/components/template/Topbar";
import ProgressBar from "@/components/Progressbar/Progressbar";

const Page = () => {
  const router = useRouter();

  const totalSteps = 6;
  const [currentStep, setCurrentStep] = useState(5);

  const inputEmail = useEmailStore((state) => state.inputEmail);
  const password = usePasswordStore((state) => state.password);
  const [inputNickname, setInputNickname] = useState<string>("");

  const setNickname = useNicknameStore((state) => state.setNickname);

  // 닉네임 에러 메시지를 state로 관리
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState("");

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
    try {
      const checkData = await getNicknameCheck(inputNickname);

      // 서버 응답에서 중복된 닉네임이면
      if (checkData.isAvailable === false) {
        setNicknameErrorMessage("이미 존재하는 닉네임입니다.");
        return;
      }

      await getMailSignUp(inputEmail, password, inputNickname);

      setNickname(inputNickname);

      setCurrentStep((prev) => Math.min(prev + 1, 6));
      router.push("/signup-complete");
    } catch (error) {
      // 200이 아닌 경우에도 여기서 에러 메시지 띄움
      setNicknameErrorMessage("이미 존재하는 닉네임입니다.");
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <Topbar _leftImage={<button onClick={() => router.back()}><Backward /></button>} _topNode="제목" />
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
          _rightNode={
            isNicknameValid && !nicknameErrorMessage ? <Check /> : null
          }
          _onChange={handleNicknameChange}
        />
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="닉네임 등록하기"
            _buttonProps={{
              className: "hover:cursor-pointer",
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
