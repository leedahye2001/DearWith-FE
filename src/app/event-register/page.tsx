"use client";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Reference from "@/svgs/Reference.svg";
import { useState } from "react";

const Page = () => {
  const [inputTwitter, setInputTwitter] = useState<string>("");

  const handleEmailSendChange = (inputTwitter: string) => {
    setInputTwitter(inputTwitter);
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center w-full">
      <Topbar _leftImage={<Backward />} _topNode="이벤트 등록" />
      <div className="flex w-full">
        <div className="flex flex-col justify-center items-start mb-[24px]">
          <div className="flex justify-center items-center gap-[6px] mt-[36px] mb-[20px]">
            <div className="flex justify-center items-center rounded-xl w-[16px] h-[16px] bg-primary text-text-1 font-[600] text-[12px]">
              1
            </div>
            <h3 className="text-text-5 text-[16px] font-[700]">
              주최자 정보를 입력해주세요
            </h3>
          </div>

          <div className="flex flex-col justity-center items-start mb-[16px]">
            <div className="flex items-center gap-[2px] mb-[6px]">
              <p className="text-text-5 text-[14px] font-[600]">주최자 여부</p>
              <Reference />
            </div>

            <div className="flex justify-between gap-[8px] w-full">
              <Button
                _state="main"
                _node="주최자 입니다."
                _buttonProps={{
                  className: `hover:cursor-pointer bg-[#FD725C]`,
                }}
              />
              <Button
                _state="main"
                _node="주최자가 아닙니다."
                _buttonProps={{
                  className: `hover:cursor-pointer bg-bg-1 text-[#FD725C] border-[1px] border-[#FD725C]`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-col justity-center items-start mb-[16px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              주최자 트위터 계정
            </p>
            <Input
              _value={inputTwitter}
              _state="textbox-basic"
              _bottomNode={""}
              _onChange={handleEmailSendChange}
              _wrapperProps={{ }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
