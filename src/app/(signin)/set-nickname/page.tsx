"use client";

import { useState } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";
import Check from "@/svgs/Check.svg";
import Bottombar from "@/components/template/Bottombar";
import { getNicknameCheck, updateNickname } from "@/apis/api";
import useUserStore from "@/app/stores/userStore";
import Popup from "@/components/Popup/Popup";

const Page = () => {
  const router = useRouter();
  const [inputNickname, setInputNickname] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);

  const handleNicknameChange = (inputNickname: string) => {
    setInputNickname(inputNickname);
  };

  const isNicknameValid = inputNickname
    ? /^[a-zA-Z0-9가-힣]{2,8}$/.test(inputNickname)
    : false;

  const nicknameErrorMessage = !isNicknameValid
    ? "영문, 한글, 숫자 중 2-8자리"
    : "";

  const fetchNicknameCheckData = async () => {
    try {
      // 닉네임 중복 확인
      const checkData = await getNicknameCheck(inputNickname);
      if (checkData.isAvailable === false) {
        alert("이미 사용 중인 닉네임입니다.");
        return;
      }

      // 닉네임 업데이트
      await updateNickname(inputNickname);
      // console.log("닉네임 업데이트 response", updateData);

      const user = useUserStore.getState();
      useUserStore.getState().setUser({
        ...user,
        nickname: inputNickname,
      });

      setShowPopup(true);
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
            _onClick={fetchNicknameCheckData}
          />
        }
      />
      {showPopup && (
        <Popup
          _titleNode={
            <div>
              반가워요! 👋
              <br />
              지금 디어위드에서
              <br /> 진행 중인 이벤트를 확인해 보세요.
            </div>
          }
          _buttonNode={
            <Button
              _state="main"
              _node="시작하기"
              _buttonProps={{ className: "hover:cursor-pointer" }}
              _onClick={() => router.push("/main")}
            />
          }
        />
      )}
    </div>
  );
};

export default Page;
