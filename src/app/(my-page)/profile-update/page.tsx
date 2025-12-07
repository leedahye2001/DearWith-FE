"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import ProfileBasic from "@/svgs/ProfileBasic.svg";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/app/stores/userStore";
import Bottombar from "@/components/template/Bottombar";

const Page = () => {
  const router = useRouter();
  const { profile } = useProfileStore();
  const [nickname, setNickname] = useState(profile?.nickname || "");
  const [profileImage, setProfileImage] = useState<string | null>(
    profile?.profileImageUrl || null
  );
  const [nicknameError, setNicknameError] = useState("");
  const [isValid, setIsValid] = useState(Boolean(profile?.nickname));
  const [showSheet, setShowSheet] = useState(false);

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (!value.trim()) {
      setNicknameError("2자 이상 입력해주세요.");
      setIsValid(false);
      return;
    }
    setNicknameError("");
    setIsValid(true);
  };

  const handleImageUpload = (file: File) => {
    setProfileImage(URL.createObjectURL(file));
  };

  const handleOpenAlbum = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
    };
    input.click();
    setShowSheet(false);
  };

  return (
    <>
      <Topbar
        _leftImage={<Backward onClick={() => router.back()} />}
        _topNode="프로필 수정"
      />

      <div className="flex flex-col justify-center items-center pt-[32px] gap-[12px] px-[24px]">
        <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden bg-gray-200">
          {profileImage ? (
            <Image
              src={profileImage}
              alt="profile"
              sizes="72px"
              fill
              className="object-cover cursor-pointer"
              onClick={() => setShowSheet(true)}
            />
          ) : (
            <ProfileBasic
              className="w-full h-full cursor-pointer"
              onClick={() => setShowSheet(true)}
            />
          )}
        </div>

        <button
          className="text-[#888] text-[13px]"
          onClick={() => setShowSheet(true)}
        >
          프로필 사진 변경
        </button>

        <div className="pt-[32px] flex flex-col justify-center">
          <Input
            _value={nickname}
            _state="textbox-basic"
            _title="닉네임"
            _bottomNode={nicknameError}
            _onChange={handleNicknameChange}
          />
        </div>
        <p className="text-text-2 underline text-[14px]">탈퇴하기</p>
        <Bottombar
          _bottomNode={
            <Button
              _state="main"
              _node="변경하기"
              _buttonProps={{ disabled: !isValid }}
              _onClick={() => console.log("변경 처리")}
            />
          }
        />
      </div>

      {showSheet && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-end z-9999">
          <div className="bg-white w-full rounded-t-[12px] p-[20px] flex flex-col text-center text-[16px] font-[500]">
            <button
              className="flex justify-start py-[16px]"
              onClick={handleOpenAlbum}
            >
              앨범에서 사진 선택
            </button>
            <Button
              _state="main"
              _node="취소"
              _buttonProps={{ className: "w-full" }}
              _onClick={() => setShowSheet(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
