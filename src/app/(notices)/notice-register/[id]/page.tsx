"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventNoticePost } from "@/apis/api";
import useModalStore from "@/app/stores/useModalStore";
import Button from "@/components/Button/Button";

const NoticeRegisterPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const { openAlert } = useModalStore();
  const params = useParams<{ id: string }>();
  const eventId = params?.id ?? "";

  const maxLength = 300;

  const handleSubmit = async () => {
    if (!title.trim()) return openAlert("제목을 입력해주세요.");
    if (!content.trim()) return openAlert("내용을 입력해주세요.");

    try {
      await eventNoticePost(title, content, eventId);
      openAlert("공지 등록이 완료되었습니다.");
      router.back();
    } catch (e) {
      console.error(e);
      openAlert("제목과 내용을 입력해주세요.");
    }
  };

  return (
    <div className="w-full px-[24px] pt-[20px] flex flex-col">
      <h1 className="text-[18px] font-[700] mb-[20px]">공지사항 등록</h1>

      {/* 제목 */}
      <label className="text-[14px] font-[600] mb-[6px]">제목</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력해주세요."
        className="border border-text-3 rounded-[6px] px-[12px] py-[10px] text-[14px] mb-[20px]"
      />

      {/* 내용 */}
      <label className="text-[14px] font-[600] mb-[6px]">내용</label>
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              setContent(e.target.value);
            }
          }}
          placeholder="내용을 입력해주세요."
          className="border border-text-3 rounded-[6px] px-[12px] py-[10px] text-[14px] w-full h-[200px] resize-none"
        />

        {/* 글자 수 표시 */}
        <span className="absolute bottom-[10px] right-[12px] text-[12px] text-text-3">
          {content.length}/{maxLength}
        </span>
      </div>

      {/* 버튼 */}
      <Button
        _state="main"
        _node="등록하기"
        _buttonProps={{
          className: "hover:cursor-pointer",
        }}
        _onClick={handleSubmit}
      />
    </div>
  );
};

export default NoticeRegisterPage;
