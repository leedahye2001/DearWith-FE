"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { eventNoticePost, getEventDetail } from "@/apis/api";
import useModalStore from "@/app/stores/useModalStore";
import Button from "@/components/Button/Button";
import Topbar from "@/components/template/Topbar";
import Bottombar from "@/components/template/Bottombar";
import Backward from "@/svgs/Backward.svg";
import Input from "@/components/Input/Input";
import Spinner from "@/components/Spinner/Spinner";

const NoticeRegisterPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { openAlert } = useModalStore();
  const params = useParams<{ id: string }>();
  const eventId = params?.id ?? "";

  const maxLength = 300;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const event = await getEventDetail(eventId);
        setEventTitle(event.title || "");
      } catch (err) {
        console.error("이벤트 정보 조회 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

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

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col justify-center w-full pb-[120px]">
      <Topbar
        _leftImage={<Backward onClick={() => router.back()} />}
        _topNode={eventTitle}
      />
      <div className="px-[24px] pt-[36px]">
        {/* 제목 */}
        <Input
          _value={title}
          _state="textbox-basic"
          _title="제목"
          _onChange={setTitle}
          _inputProps={{
            placeholder: "제목을 입력해주세요.",
            className: `placeholder:text-text-3`,
          }}
          _containerProps={{ className: "mb-[31px]" }}
        />

        {/* 내용 */}
        <div className="w-full">
          <label className="text-[14px] font-[600] mb-[6px] block">내용</label>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= maxLength) {
                  setContent(e.target.value);
                }
              }}
              placeholder="내용을 입력해주세요."
              className="border border-divider-2 rounded-[4px] px-[10px] py-[10px] text-[14px] w-full h-[200px] resize-none outline-none placeholder:text-text-3"
            />

            {/* 글자 수 표시 */}
            <span className="absolute bottom-[10px] right-[12px] text-[12px] text-text-3">
              {content.length}/{maxLength}
            </span>
          </div>
        </div>
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="등록하기"
            _onClick={handleSubmit}
          />
        }
      />
    </div>
  );
};

export default NoticeRegisterPage;
