"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { postSystemNotice } from "@/apis/api";
import useModalStore from "@/app/stores/useModalStore";
import Button from "@/components/Button/Button";
import Topbar from "@/components/template/Topbar";
import Bottombar from "@/components/template/Bottombar";
import Backward from "@/svgs/Backward.svg";
import Input from "@/components/Input/Input";
import Checkbox from "@/components/Checkbox/Checkbox";

const SystemNoticeRegisterPage = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [important, setImportant] = useState(false);
    const router = useRouter();
    const { openAlert } = useModalStore();

    const maxLength = 300;

    const handleSubmit = async () => {
        if (!title.trim()) return openAlert("제목을 입력해주세요.");
        if (!content.trim()) return openAlert("내용을 입력해주세요.");

        try {
            await postSystemNotice(title, content, important);
            openAlert("공지 등록이 완료되었습니다.");
            router.push("/system-notices");
        } catch (e) {
            console.error(e);
            const axiosError = e as AxiosError<{ message?: string; detail?: string }>;
            const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "공지 등록에 실패했습니다.";
            openAlert(errorMessage);
        }
    };

    return (
        <div className="flex flex-col justify-center w-full pb-[120px]">
            <Topbar
                _leftImage={<Backward onClick={() => router.back()} />}
                _topNode="공지사항"
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
                    <label className="typo-label2 mb-[6px] block">내용</label>
                    <div className="relative">
                        <textarea
                            value={content}
                            onChange={(e) => {
                                if (e.target.value.length <= maxLength) {
                                    setContent(e.target.value);
                                }
                            }}
                            placeholder="내용을 입력해주세요."
                            className="border border-divider-2 rounded-[4px] px-[10px] py-[10px] typo-body2 w-full h-[390px] resize-none outline-none placeholder:text-text-3"
                        />
                    </div>
                </div>

                <div className="mt-[16px]">
                    <Checkbox
                        _id="important"
                        _value={<span className="typo-body2 text-text-3">필독 공지로 등록하기</span>}
                        _type="icon2"
                        _checked={important}
                        _onChange={setImportant}
                    />
                </div>
            </div>
            <Bottombar
                _bottomNode={
                    <Button
                        _state="main"
                        _node="등록하기"
                        _onClick={handleSubmit}
                        _buttonProps={{ className: "hover:cursor-pointer" }}
                    />
                }
            />
        </div>
    );
};

export default SystemNoticeRegisterPage;
