"use client";

import { useState } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import Check from "@/svgs/Check.svg";
import Bottombar from "@/components/template/Bottombar";
import { getNicknameCheck } from "@/apis/api";

const Page = () => {
  const router = useRouter();
  const [inputNickname, setInputNickname] = useState<string>("");

  const handleNicknameChange = (inputNickname: string) => {
    setInputNickname(inputNickname);
  };

  const isNicknameValid = inputNickname
    ? /^[a-zA-Z0-9가-힣]{2,8}$/.test(inputNickname)
    : false;

  const nicknameErrorMessage = !isNicknameValid
    ? "영문, 한글, 숫자 중 2-8자리"
    : "";

  const fetchNicknameCkeckData = async () => {
    try {
      await getNicknameCheck(inputNickname);
      router.push("/main");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      <div className="px-[24px] pt-[58px]">
        <h2 className="font-[700] text-text-5 text-[20px] pb-[4px]">
          디어위드와 함께해요!
        </h2>
        <p className="font-[400] text-text-4 text-[14px] pb-[52px]">
          닉네임은 영문, 한글, 숫자만 입력할 수 있어요.
        </p>
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
            _buttonProps={{ className: "hover:cursor-pointer" }}
            _onClick={fetchNicknameCkeckData}
          />
        }
      />
    </div>
  );
};

export default Page;
