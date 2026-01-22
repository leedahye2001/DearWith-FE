"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerInquiry } from "@/apis/api";
import useModalStore from "@/app/stores/useModalStore";
import Button from "@/components/Button/Button";
import Topbar from "@/components/template/Topbar";
import Bottombar from "@/components/template/Bottombar";
import Backward from "@/svgs/Backward.svg";
import Input from "@/components/Input/Input";

const InquiryRegisterPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const { openAlert } = useModalStore();

  const maxLength = 300;

  const handleSubmit = async () => {
    if (!title.trim()) return openAlert("제목을 입력해주세요.");
    if (!content.trim()) return openAlert("내용을 입력해주세요.");

    try {
      await registerInquiry(title, content);
      openAlert("문의 글이 등록되었습니다.");
      router.back();
    } catch (e) {
      console.error(e);
      openAlert("제목과 내용을 입력해주세요.");
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  const handleContentChange = (value: string) => {
    if (value.length <= maxLength) {
      setContent(value);
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
        _topNode="1:1 문의하기"
      />
      <div className="w-full px-[24px] pt-[20px] flex flex-col">
        {/* 제목 */}
        <Input
          _value={title}
          _state="textbox-basic"
          _onChange={handleTitleChange}
          _title="제목"
          _inputProps={{
            placeholder: "제목을 입력해주세요.",
            className: "placeholder:text-text-3 typo-body2",
          }}
        />

        {/* 내용 */}
        <label className="typo-label2 mt-[16px] mb-[8px]">
          내용
        </label>

        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="내용을 입력해주세요."
            className="border border-divider-2 rounded-[6px] px-[12px] pt-[10px] pb-[18px] typo-body2 w-full h-[200px] resize-none "
          />

          {/* 글자 수 카운터 */}
          <span className="absolute bottom-[10px] right-[12px] typo-caption3 text-text-3">
            {content.length}/{maxLength}
          </span>
        </div>
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="등록하기"
            _buttonProps={{
              className: "hover:cursor-pointer w-full",
            }}
            _onClick={handleSubmit}
          />
        }
      />
    </div>
  );
};

export default InquiryRegisterPage;
