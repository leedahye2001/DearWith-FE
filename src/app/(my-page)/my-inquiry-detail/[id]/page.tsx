"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Backward from "@/svgs/Backward.svg";
import Topbar from "@/components/template/Topbar";
import Spinner from "@/components/Spinner/Spinner";
import Button from "@/components/Button/Button";
import useModalStore from "@/app/stores/useModalStore";
import { answerSatisfaction, getMyInquiryDetail } from "@/apis/api";

interface InquiryDetail {
  id: string;
  answered: boolean;
  title: string;
  content: string;
  createdAt: string;
  satisfactionStatus: string;
  answer: {
    content: string;
    answeredAt: string;
  };
}

const InquiryDetailPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const inquiryId = params?.id ?? "";

  const { openAlert, openConfirm } = useModalStore();

  const [notice, setNotice] = useState<InquiryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [satisfaction, setSatisfaction] = useState<"good" | "bad">("good");

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yy}.${mm}.${dd} ${hh}:${min}`;
  };

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const res = await getMyInquiryDetail(inquiryId);
        setNotice(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [inquiryId]);

  // 만족도 API 처리
  const handleSatisfaction = (type: "good" | "bad") => {
    const apiType = type === "good" ? "SATISFACTION" : "UNSATISFACTION";

    openConfirm("소중한 의견 감사합니다.", async () => {
      try {
        await answerSatisfaction(inquiryId, apiType);
        openAlert("의견이 제출되었습니다.");
        setSatisfaction(type);
      } catch (e) {
        console.error(e);
        openAlert("오류가 발생했습니다.");
      }
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-text-5">
        <Spinner />
      </div>
    );

  if (!notice)
    return (
      <div className="flex justify-center items-center h-screen text-text-5">
        글을 불러올 수 없습니다.
      </div>
    );

  return (
    <>
      <Topbar
        _leftImage={
          <button onClick={() => router.back()}>
            <Backward />
          </button>
        }
        _topNode="1:1 문의하기"
      />

      <div className="w-full bg-bg-1 min-h-screen px-[24px]">
        <div className="mt-[24px]">
          <h1 className="text-[16px] font-[700] text-text-5">{notice.title}</h1>

          <div className="flex items-center gap-[4px] mt-[4px] text-[12px] text-text-4">
            <span>{formatDate(notice.createdAt)}</span>
          </div>

          <div className="mt-[20px] py-[32px] text-[15px] text-text-5 leading-[1.6] whitespace-pre-line border-y border-divider-1">
            {notice.content}
          </div>
          {notice.answer && (
            <>
              <div className="flex flex-col gap-[16px] py-[32px] border-b border-divider-1 mb-[28px]">
                <div className="flex justify-between items-center gap-[4px]">
                  <p className="text-[14px] text-text-5 font-[500]">디어위드</p>
                  <span className="text-[12px] text-text-3 font-[400]">
                    {formatDate(notice.answer.answeredAt)}
                  </span>
                </div>

                <div className="text-[15px] text-text-5 leading-[1.6] whitespace-pre-line">
                  {notice.answer.content}
                </div>
              </div>
              <div className="flex flex-col justify-center items-center gap-[16px]">
                <h2 className="text-[14px] text-text-5 font-[700]">
                  답변에 만족하셨나요?
                </h2>

                <div className="flex gap-[8px]">
                  {/* 아쉬워요 */}
                  <Button
                    _state="main"
                    _node="아쉬워요"
                    _onClick={() => handleSatisfaction("bad")}
                    _buttonProps={{
                      className: `hover:cursor-pointer w-[160px] ${
                        satisfaction === "bad"
                          ? "bg-red-400 text-text-1 text-[14px] font-[500]"
                          : "bg-bg-2 text-text-3 text-[14px] font-[500]"
                      }`,
                    }}
                  />

                  {/* 만족해요 */}
                  <Button
                    _state="main"
                    _node="만족해요"
                    _onClick={() => handleSatisfaction("good")}
                    _buttonProps={{
                      className: `hover:cursor-pointer w-[160px] ${
                        satisfaction === "good"
                          ? "bg-red-400 text-text-1 text-[14px] font-[500]"
                          : "bg-bg-2 text-text-3 text-[14px] font-[500]"
                      }`,
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InquiryDetailPage;
