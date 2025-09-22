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
    <div className="flex flex-col justify-center w-full">
      <Topbar _leftImage={<Backward />} _topNode="이벤트 등록" />
      <div className="flex w-full p-[24px]">
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
                  className: `hover:cursor-pointer bg-[#FD725C] w-[160px]`,
                }}
              />
              <Button
                _state="main"
                _node="주최자가 아닙니다."
                _buttonProps={{
                  className: `w-[160px] hover:cursor-pointer bg-bg-1 text-[#FD725C] border-[1px] border-[#FD725C]`,
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
              _wrapperProps={{}}
            />
          </div>

          <div className="flex flex-col justity-center items-start mb-[48px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              트위터 링크 (예시)
            </p>
            <Input
              _value={inputTwitter}
              _state="textbox-basic"
              _bottomNode={""}
              _onChange={handleEmailSendChange}
              _wrapperProps={{}}
            />
          </div>

          <div className="flex justify-center items-center gap-[6px] mt-[36px] mb-[20px]">
            <div className="flex justify-center items-center rounded-xl w-[16px] h-[16px] bg-primary text-text-1 font-[600] text-[12px]">
              2
            </div>
            <h3 className="text-text-5 text-[16px] font-[700]">
              이벤트 정보를 입력해주세요
            </h3>
          </div>

          <div className="flex flex-col justity-center items-start mb-[16px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              아티스트 명
            </p>
            <Input
              _value={inputTwitter}
              _state="textbox-basic"
              _bottomNode={""}
              _onChange={handleEmailSendChange}
              _wrapperProps={{}}
            />
          </div>

          <div className="flex flex-col justity-center items-start mb-[16px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              이벤트 명
            </p>
            <Input
              _value={inputTwitter}
              _state="textbox-basic"
              _bottomNode={""}
              _onChange={handleEmailSendChange}
              _wrapperProps={{}}
            />
          </div>

          <div className="flex flex-col justity-center items-start mb-[16px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              이벤트 기간
            </p>
            <Input
              _value={inputTwitter}
              _state="textbox-basic"
              _bottomNode={""}
              _onChange={handleEmailSendChange}
              _wrapperProps={{}}
            />
          </div>

          <div className="flex flex-col justity-center items-start mb-[16px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">장소</p>
            <Input
              _value={inputTwitter}
              _state="textbox-basic"
              _bottomNode={""}
              _onChange={handleEmailSendChange}
              _wrapperProps={{}}
            />
          </div>

          <div className="flex flex-col justity-center items-start mb-[16px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              카페 명
            </p>
            <Input
              _value={inputTwitter}
              _state="textbox-basic"
              _bottomNode={""}
              _onChange={handleEmailSendChange}
              _wrapperProps={{}}
            />
          </div>

          <div className="flex flex-col justity-center items-start mb-[16px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              이미지
            </p>
            <Input
              _value={inputTwitter}
              _state="textbox-basic"
              _bottomNode={""}
              _onChange={handleEmailSendChange}
              _wrapperProps={{}}
            />
          </div>

          <div className="flex justify-center items-center gap-[6px] mt-[36px] mb-[20px]">
            <div className="flex justify-center items-center rounded-xl w-[16px] h-[16px] bg-primary text-text-1 font-[600] text-[12px]">
              3
            </div>
            <h3 className="text-text-5 text-[16px] font-[700]">
              특전 및 상품 정보를 입력해주세요
            </h3>
          </div>

          <div className="flex flex-col justity-center items-start mb-[16px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              기본 특전
            </p>
            <div className="flex gap-[8px]">
              <Input
                _value={inputTwitter}
                _state="textbox-basic"
                _bottomNode={""}
                _onChange={handleEmailSendChange}
                _wrapperProps={{ className: `w-[244px]` }}
              />
              <Button
                _state="main"
                _node="등록하기"
                _buttonProps={{
                  className: `hover:cursor-pointer bg-[#FD725C] w-[75px]`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-col justity-center items-start mb-[16px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              선착 특전
            </p>
            <div className="flex gap-[8px]">
              <Input
                _value={inputTwitter}
                _state="textbox-basic"
                _bottomNode={""}
                _onChange={handleEmailSendChange}
                _wrapperProps={{ className: `w-[244px]` }}
              />
              <Button
                _state="main"
                _node="등록하기"
                _buttonProps={{
                  className: `hover:cursor-pointer bg-[#FD725C] w-[75px]`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-col justity-center items-start mb-[60px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              럭키드로우 특전
            </p>
            <div className="flex gap-[8px]">
              <Input
                _value={inputTwitter}
                _state="textbox-basic"
                _bottomNode={""}
                _onChange={handleEmailSendChange}
                _wrapperProps={{ className: `w-[244px]` }}
              />
              <Button
                _state="main"
                _node="등록하기"
                _buttonProps={{
                  className: `hover:cursor-pointer bg-[#FD725C] w-[75px]`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-col bg-secondary-300 w-[327.5px] rounded-[8px] h-[152px] p-[16px] mb-[48px]">
            <div className="flex w-full justify-start items-center gap-[6px] mb-[16px]">
              <div className="flex justify-center items-center rounded-xl w-[14px] h-[14px] bg-primary text-secondary-300 font-[600] text-[12px]">
                !
              </div>
              <p className="flex justify-center items-center text-text-5 text-[14px] font-[600]">
                이벤트 등록 시 유의 사항
              </p>
            </div>
            <p className="text-text-4 text-[12px] font-[400]">
              · 이벤트 기간은 최소 1일 이상입니다.
            </p>
            <p className="text-text-4 text-[12px] font-[400]">
              {`· 이벤트 예약 확인은 [마이>이벤트 관리] 에서 확인하실 수 있습니다.`}
            </p>
            <p className="text-primary text-[12px] font-[400]">
              · 이벤트 등록 및 진행에 관하여 발생된 모든 문제는 디어위드에서
              책임지지 않습니다.
            </p>
          </div>

          <Button
            _state="main"
            _node="이벤트 등록하기"
            _buttonProps={{
              className: `hover:cursor-pointer`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
