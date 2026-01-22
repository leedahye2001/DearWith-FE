"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import ProfileUpdate from "@/svgs/ProfileUpdate.svg";
import { useRouter } from "next/navigation";
import { useProfileStore, useAuthStore } from "@/app/stores/userStore";
import useUserStore from "@/app/stores/userStore";
import Bottombar from "@/components/template/Bottombar";
import useModalStore from "@/app/stores/useModalStore";
import {
  deleteProfileImage,
  updateNickname,
  updateProfileImage,
} from "@/apis/api";
import WithdrawModal from "@/components/Modal/WithdrawModal/WithdrawModal";
import api from "@/apis/instance";
import Add from "@/svgs/Add.svg";
import { AxiosError } from "axios";
import Spinner from "@/components/Spinner/Spinner";

const Page = () => {
  const router = useRouter();
  const { openAlert } = useModalStore();
  const { profile } = useProfileStore();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const initialNickname = profile?.nickname ?? "";
  const initialProfileImage = profile?.profileImageUrl || null;

  const [nickname, setNickname] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState("");
  const [isValidNickname, setIsValidNickname] = useState(true);

  const [profileImage, setProfileImage] = useState<string | null>(
    initialProfileImage
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [showSheet, setShowSheet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNicknameChange = (value: string) => {
    setNickname(value);

    if (!value.trim() || value.trim().length < 2) {
      setNicknameError("2자 이상 입력해주세요.");
      setIsValidNickname(false);
    } else {
      setNicknameError("");
      setIsValidNickname(true);
    }
  };

  const handleImageUpload = (file: File) => {
    setProfileImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  const handleOpenAlbum = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) handleImageUpload(file);
    };
    input.click();
    setShowSheet(false);
  };

  const handleDeleteImage = async () => {
    setShowSheet(false);
    setProfileImage(null);
    setImageFile(null);
  };

  const putToS3 = async (url: string, file: File, contentType: string) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
      credentials: "omit",
      mode: "cors",
    });
    if (!res.ok) throw new Error("S3 업로드 실패");
  };

  const uploadImage = async (file: File): Promise<string> => {
    const presignRes = await api.post("/api/uploads/presign", {
      filename: file.name,
      contentType: file.type,
      domain: "artist",
    });

    const { url, key } = presignRes.data as { url: string; key: string };

    await putToS3(url, file, file.type || "application/octet-stream");

    return key;
  };

  const nicknameChanged = nickname !== initialNickname;
  const profileImageChanged = imageFile !== null;

  const profileImageDeleted =
    (initialProfileImage && profileImage === null) || profileImage === "";

  const canSubmit =
    (nicknameChanged || profileImageChanged || profileImageDeleted) &&
    isValidNickname;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);

      if (profileImageDeleted) {
        await deleteProfileImage();
      }

      if (profileImageChanged && imageFile) {
        const tmpKey = await uploadImage(imageFile);
        await updateProfileImage(tmpKey);
      }

      if (nicknameChanged) {
        await updateNickname(nickname);
      }

      openAlert("프로필이 성공적으로 변경되었습니다.");
      router.back();
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "비밀번호 변경에 실패했습니다. 다시 시도해주세요.";
      openAlert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const handleWithdrawComplete = () => {
    useUserStore.getState().clearUser();
    useAuthStore.getState().clearTokens();
    router.replace("/login");
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Topbar
        _leftImage={<Backward onClick={() => router.back()} />}
        _topNode="프로필 수정"
      />

      <div className="pt-[32px] gap-[12px] px-[24px] flex flex-col justify-center items-center">
        <div className="items-center justify-center flex flex-col">
          {/* 이미지 업로드 */}
          <div className="relative w-[72px] h-[72px]">
            <div className="rounded-full flex justify-center items-center w-[72px] h-[72px] cursor-pointer overflow-hidden">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="profile"
                  fill
                  className="object-cover rounded-full"
                  onClick={() => setShowSheet(true)}
                />
              ) : (
                <ProfileUpdate onClick={() => setShowSheet(true)} />
              )}
            </div>

            {/* 추가 버튼 (우측하단 겹치기) */}
            <div
              className="absolute bottom-0 right-0 bg-red-400 w-[20px] h-[20px] rounded-full flex items-center justify-center border border-white z-50 cursor-pointer"
              onClick={() => setShowSheet(true)}
            >
              <Add />
            </div>
          </div>
        </div>
        <div className="w-full pt-[32px] flex flex-col justify-center">
          <Input
            _value={nickname}
            _state="textbox-basic"
            _title="닉네임"
            _bottomNode={nicknameError}
            _onChange={handleNicknameChange}
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* 변경하기 */}
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="변경하기"
            _buttonProps={{ disabled: !canSubmit || isSubmitting, className: "w-full" }}
            _onClick={handleSubmit}
          />
        }
      />

      {/* 탈퇴하기 */}
      <div className="px-[24px] pb-[100px]">
        <p
          className="text-text-2 underline typo-body2 cursor-pointer text-center"
          onClick={handleWithdraw}
        >
          탈퇴하기
        </p>
      </div>

      {showSheet && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-end z-[9999]">
          <div className="bg-white w-full rounded-t-[12px] p-[20px] flex flex-col text-center typo-label1">
            <button
              className="flex justify-start py-[16px]"
              onClick={handleOpenAlbum}
            >
              앨범에서 사진 선택
            </button>
            {profileImage && (
              <button
                className="flex justify-start py-[16px] border-t border-divider-1"
                onClick={handleDeleteImage}
              >
                프로필 사진 삭제
              </button>
            )}
            <Button
              _state="main"
              _node="취소"
              _buttonProps={{ className: "w-full" }}
              _onClick={() => setShowSheet(false)}
            />
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => {
            setShowWithdrawModal(false);
          }}
          onSuccess={handleWithdrawComplete}
        />
      )}

      {isSubmitting && <Spinner />}
    </div>
  );
};

export default Page;
