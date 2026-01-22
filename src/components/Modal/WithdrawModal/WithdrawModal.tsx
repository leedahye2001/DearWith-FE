"use client";

import { useState } from "react";
import Button from "@/components/Button/Button";
import useModalStore from "@/app/stores/useModalStore";
import { WithdrawReason, withdrawUser } from "@/apis/api";
import { AxiosError } from "axios";

interface WithdrawModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const WITHDRAW_REASONS: { value: WithdrawReason; label: string }[] = [
  { value: "NO_LONGER_NEEDED", label: "디어위드 사용이 필요 없어짐" },
  { value: "LACK_OF_INFO", label: "부실한 정보가 많음" },
  { value: "TOO_COMMERCIAL", label: "상업적인 내용이 많음" },
  { value: "OTHER", label: "그 외 사유" },
];

export default function WithdrawModal({ onClose, onSuccess }: WithdrawModalProps) {
  const [selectedReason, setSelectedReason] = useState<WithdrawReason>("NO_LONGER_NEEDED");
  const [detail, setDetail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openAlert } = useModalStore();

  const maxLength = 300;

  const handleDetailChange = (value: string) => {
    if (value.length <= maxLength) {
      setDetail(value);
    }
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      openAlert("탈퇴 사유를 선택해주세요.");
      return;
    }
    if (!detail.trim()) {
      openAlert("탈퇴 사유를 입력해주세요.");
      return;
    }
    if (detail.trim().length < 2) {
      openAlert("탈퇴 사유를 2자 이상 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      await withdrawUser(selectedReason, detail || "");
      openAlert("탈퇴가 완료되었습니다.\n그동안 이용해주셔서 감사합니다.", () => {
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      });
    } catch (e) {
      console.error(e);
      let errorMessage = "탈퇴 처리에 실패했습니다. 다시 시도해주세요.";
      if (e instanceof AxiosError && e.response?.data?.message) {
        errorMessage = e.response.data.message;
      }
      openAlert(errorMessage, () => {
        // 에러 메시지 확인 시 탈퇴 모달도 닫기
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
          탈퇴 사유를 선택해주세요.
        </h2>

        <div className="flex flex-col gap-[16px] mb-[24px]">
          {/* 탈퇴 사유 라디오 버튼 */}
          <div className="flex flex-col gap-[12px]">
            {WITHDRAW_REASONS.map((reason) => (
              <label
                key={reason.value}
                className="flex items-center gap-[12px] cursor-pointer"
              >
                <input
                  type="radio"
                  name="withdrawReason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onChange={() => setSelectedReason(reason.value)}
                  className="w-[20px] h-[20px] accent-primary cursor-pointer"
                />
                <span className="typo-label2 text-text-5">{reason.label}</span>
              </label>
            ))}
          </div>

          {/* 탈퇴 사유 입력 필드 */}
          <div className="flex flex-col">
            <textarea
              value={detail}
              onChange={(e) => handleDetailChange(e.target.value)}
              placeholder="탈퇴 사유를 입력해주세요."
              className="w-full h-[174px] p-[10px] border border-divider-2 rounded-[4px] typo-body2 text-text-3 outline-none resize-none"
              maxLength={maxLength}
            />
          </div>
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
            _node="탈퇴하기"
            _onClick={handleSubmit}
            _buttonProps={{ disabled: isSubmitting }}
          />
        </div>
      </div>
    </div>
  );
}
