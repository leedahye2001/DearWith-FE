"use client";

import { useState } from "react";
import Button from "@/components/Button/Button";
import useModalStore from "@/app/stores/useModalStore";
import { ReportReason, reportReview } from "@/apis/api";
import { AxiosError } from "axios";

interface ReportModalProps {
  reviewId: string;
  onClose: () => void;
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "OFF_TOPIC", label: "이벤트와 관련 없는 내용" },
  { value: "HATE", label: "근거 없는 비난" },
  { value: "SPAM", label: "상업적인 내용" },
  { value: "OTHER", label: "그 외 사유" },
];

export default function ReportModal({
  reviewId,
  onClose,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openAlert } = useModalStore();

  const maxLength = 300;
  const showContentInput = selectedReason === "OTHER";

  const handleContentChange = (value: string) => {
    if (value.length <= maxLength) {
      setContent(value);
    }
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      openAlert("신고 사유를 선택해주세요.");
      return;
    }
    if (showContentInput && !content.trim()) {
      openAlert("신고가 완료되었습니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      await reportReview(reviewId, selectedReason, content || "");
      openAlert("신고가 접수되었습니다.");
      onClose();
    } catch (e) {
      console.error(e);
      let errorMessage = "신고 접수에 실패했습니다. 다시 시도해주세요.";
      if (e instanceof AxiosError && e.response?.data?.message) {
        errorMessage = e.response.data.message;
      }
      openAlert(errorMessage, () => {
        // 에러 메시지 확인 시 신고 모달도 닫기
        onClose();
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-[24px]">
      <div className="w-full max-w-[400px] bg-bg-1 rounded-[12px] flex flex-col p-[24px] shadow-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-text-5 typo-title3 mb-[24px] text-start">
          신고 사유를 선택해주세요.
        </h2>

        <div className="flex flex-col gap-[16px] mb-[24px]">
          {/* 신고 사유 라디오 버튼 */}
          <div className="flex flex-col gap-[12px]">
            {REPORT_REASONS.map((reason) => (
              <label
                key={reason.value}
                className="flex items-center gap-[12px] cursor-pointer"
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={() => setSelectedReason(reason.value)}
                  className="w-[20px] h-[20px] accent-primary cursor-pointer"
                />
                <span className="typo-label2 text-text-5">{reason.label}</span>
              </label>
            ))}
          </div>

          {/* 그 외 사유 선택 시 내용 입력 필드 */}
          {showContentInput && (
            <div className="flex flex-col">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="신고 내용을 입력해주세요."
                className="w-full h-[174px] p-[10px] border border-divider-2 rounded-[4px] typo-body2 text-text-3 outline-none resize-none"
                maxLength={maxLength}
              />
            </div>
          )}
        </div>

        <div className="flex gap-[12px]">
          <Button
            _state="main"
            _buttonProps={{ 
              className: "bg-bg-2 text-text-5",
              disabled: isSubmitting 
            }}
            _node="취소"
            _onClick={onClose}
          />
          <Button
            _state="main"
            _node={isSubmitting ? "신고 중..." : "신고하기"}
            _onClick={handleSubmit}
            _buttonProps={{ disabled: isSubmitting }}
          />
        </div>
      </div>
    </div>
  );
}
