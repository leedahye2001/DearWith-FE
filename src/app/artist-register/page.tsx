"use client";

import api from "@/apis/instance";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Topbar from "@/components/template/Topbar";
import Bottombar from "@/components/template/Bottombar";
import Backward from "@/svgs/Backward.svg";
import ProfileArtist from "@/svgs/ProfileArtist.svg";
import Add from "@/svgs/Add.svg";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useModalStore from "../stores/useModalStore";

const Page = () => {
  const router = useRouter();
  const handleBackRouter = () => router.back();
  const { openAlert } = useModalStore();

  const [registerType, setRegisterType] = useState<"artist" | "group">(
    "artist"
  );

  const [artistName, setArtistName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [birthDate, setBirthDate] = useState(""); // yyyy-mm-dd 형식
  const [debut, setDebut] = useState(""); // yyyy-mm-dd 형식

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 날짜 포맷팅 함수 (숫자만 허용, 자동 하이픈 추가)
  const formatDateInput = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, "");
    
    // 최대 8자리까지만 허용 (yyyyMMdd)
    const limitedNumbers = numbers.slice(0, 8);
    
    // 길이에 따라 하이픈 추가
    if (limitedNumbers.length <= 4) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 4)}-${limitedNumbers.slice(4)}`;
    } else {
      return `${limitedNumbers.slice(0, 4)}-${limitedNumbers.slice(4, 6)}-${limitedNumbers.slice(6)}`;
    }
  };

  // 생일 입력 핸들러
  const handleBirthDateChange = (value: string) => {
    const formatted = formatDateInput(value);
    setBirthDate(formatted);
  };

  // 데뷔일 입력 핸들러
  const handleDebutChange = (value: string) => {
    const formatted = formatDateInput(value);
    setDebut(formatted);
  };

  // 이미지 업로드
  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setImageFile(file);
  };

  // S3 업로드
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
    // 1. Presigned URL 요청
    const presignRes = await api.post("/api/uploads/presign", {
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      domain: "artist",
    });

    const { url, key } = presignRes.data as { url: string; key: string };

    // 2. S3에 업로드 (tmp 경로에 저장)
    await putToS3(url, file, file.type || "application/octet-stream");

    // 3. tmpKey 반환 (commit 없이)
    return key;
  };

  const handleSubmit = async () => {
    if (!imageFile) return openAlert("이미지를 등록해주세요.");

    if (registerType === "artist" && (!artistName || !birthDate))
      return openAlert("아티스트 명과 생일을 입력해주세요.");

    if (registerType === "group" && (!groupName || !debut))
      return openAlert("그룹 명과 데뷔일을 입력해주세요.");

    try {
      setIsSubmitting(true);

      // 이미지 업로드 (tmpKey 반환)
      const tmpKey = await uploadImage(imageFile);

      if (registerType === "artist") {
        const body = {
          nameKr: artistName,
          tmpKey,
          birthDate: birthDate || undefined,
        };
        await api.post("/api/artists", body);
        openAlert("아티스트 등록이 완료되었습니다.");
      } else {
        const body = {
          nameKr: groupName,
          tmpKey,
          debutDate: debut || undefined,
        };
        await api.post("/api/groups", body);
        openAlert("그룹 등록이 완료되었습니다.");
      }
      router.back();
    } catch (error) {
      console.error(error);
      openAlert("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full pb-[120px]">
      <Topbar
        _leftImage={<Backward onClick={handleBackRouter} />}
        _topNode="아티스트 등록"
      />

      <div className="px-[24px] pt-[36px]">
        <div className="flex flex-col justify-center items-center mb-[24px]">
          {/* 이미지 업로드 */}
          <div className="items-center justify-center flex flex-col mb-[32px]">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="relative w-[72px] h-[72px]">
              <div
                onClick={handleImageClick}
                className="rounded-full flex justify-center items-center w-[72px] h-[72px] cursor-pointer overflow-hidden"
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <ProfileArtist />
                )}
              </div>

              {/* 추가 버튼 (우측하단 겹치기) */}
              <div
                className="absolute bottom-0 right-0 bg-red-400 w-[20px] h-[20px] rounded-full flex items-center justify-center border border-white z-50 cursor-pointer"
                onClick={handleImageClick}
              >
                <Add />
              </div>
            </div>
            <p className="text-[10px] font-[400] text-text-3 mt-[8px]">
              아티스트 프로필 사진을 등록해주세요.
            </p>
          </div>

          {/* 등록 선택 토글 */}
          <div className="w-full">
            <h1 className="text-text-5 text-[14px] font-[600] mb-[6px]">
              등록 구분
            </h1>
            <div className="flex gap-[8px] w-full">
              <Button
                _state="main"
                _node="그룹 명 등록"
                _onClick={() => setRegisterType("group")}
                _buttonProps={{
                  className: `hover:cursor-pointer w-[160px] ${
                    registerType === "group"
                      ? "bg-red-400 text-text-1 text-[14px] font-[500] w-full"
                      : "bg-bg-1 text-text-5 text-[14px] font-[500] border-[1px] border-red-400 w-full"
                  }`,
                }}
              />
              <Button
                _state="main"
                _node="아티스트 명 등록"
                _onClick={() => setRegisterType("artist")}
                _buttonProps={{
                  className: `hover:cursor-pointer w-[160px] ${
                    registerType === "artist"
                      ? "bg-red-400 text-text-1 text-[14px] font-[500] w-full"
                      : "bg-bg-1 text-text-5 text-[14px] font-[500] border-[1px] border-red-400 w-full"
                  }`,
                }}
              />
            </div>
          </div>

          {/* FORM */}
          {registerType === "artist" ? (
            <>
              <div className="mt-6 w-full">
                <Input
                  _value={artistName}
                  _state="textbox-basic"
                  _onChange={setArtistName}
                  _title="아티스트 명 *"
                  _inputProps={{
                    placeholder: "아티스트 명을 입력해주세요.",
                    className: "placeholder:text-text-3 text-[14px]",
                  }}
                />
              </div>

              <div className="mt-4 w-full">
                <Input
                  _value={birthDate}
                  _state="textbox-basic"
                  _onChange={handleBirthDateChange}
                  _title="생일 *"
                  _inputProps={{
                    placeholder: "yyyy-mm-dd",
                    className: "placeholder:text-text-3 text-[14px]",
                    maxLength: 10,
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mt-6 w-full">
                <Input
                  _value={groupName}
                  _state="textbox-basic"
                  _onChange={setGroupName}
                  _title="그룹 명 *"
                  _inputProps={{
                    placeholder: "그룹 명을 입력해주세요.",
                    className: "placeholder:text-text-3 text-[14px]",
                  }}
                />
              </div>
              <div className="mt-4 w-full">
                <Input
                  _value={debut}
                  _state="textbox-basic"
                  _onChange={handleDebutChange}
                  _title="데뷔일 *"
                  _inputProps={{
                    placeholder: "yyyy-mm-dd",
                    className: "placeholder:text-text-3 text-[14px]",
                    maxLength: 10,
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* 안내문 */}
        <div className="flex flex-col bg-secondary-300 w-full rounded-[8px] p-[20px] mb-[62px] mt-[52px]">
          <div className="flex w-full justify-start items-center gap-[6px] pb-[8px]">
            <div className="flex justify-center items-center rounded-full w-[14px] h-[14px] bg-primary text-secondary-300 font-[600] text-[10px]">
              !
            </div>
            <p className="text-text-5 text-[14px] font-[600]">
              아티스트 등록 시 유의 사항
            </p>
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-text-4 text-[12px] font-[400]">
              · 등록한 아티스트 확인은 [마이{">"} 내 아티스트] 에서 확인하실 수
              있습니다.
            </p>
            <p className="text-primary text-[12px] font-[400]">
              · 아티스트 등록 및 진행에 관하여 발생된 모든 문제는 디어위드에서
              책임지지 않습니다.
            </p>
          </div>
        </div>
      </div>
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node="아티스트 등록하기"
            _onClick={handleSubmit}
            _buttonProps={{ disabled: isSubmitting }}
          />
        }
      />
    </div>
  );
};

export default Page;
