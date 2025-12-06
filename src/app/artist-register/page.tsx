"use client";

import { getGroup } from "@/apis/api";
import api from "@/apis/instance";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import RoundChecker from "@/svgs/RoundChecker.svg";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useModalStore from "../stores/useModalStore";

interface Group {
  id: number;
  nameKr: string;
  nameEn?: string;
  description?: string;
  imageUrl?: string;
}

const Page = () => {
  const router = useRouter();
  const handleBackRouter = () => router.back();
  const { openAlert } = useModalStore();

  const [artistName, setArtistName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [ImageTmpKey, setImageTmpKey] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 그룹 검색 관련
  const [inputGroupName, setInputGroupName] = useState("");
  const [groupResults, setGroupResults] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 업로드
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      const tmpKey = await uploadImage(file);
      setImageTmpKey(tmpKey);
    } catch (err) {
      console.error(err);
      alert("이미지 업로드 실패");
    }
  };

  // 🧩 그룹 검색 API (300ms 디바운스)
  useEffect(() => {
    if (!inputGroupName.trim()) {
      setGroupResults([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const data = await getGroup(inputGroupName);
        const groups = data?.content ?? [];
        setGroupResults(groups);
      } catch (err) {
        console.error("그룹 검색 실패:", err);
        setGroupResults([]);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [inputGroupName]);

  // 🧩 그룹명 입력 시
  const handleGroupInputChange = (value: string) => {
    setInputGroupName(value);
    setSelectedGroup(null);
    setGroupName(value);
  };

  // 🧩 그룹 선택 시
  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setGroupName(group.nameKr);
    setInputGroupName(group.nameKr);
    setGroupResults([]);
  };

  // 🧩 S3 PUT 요청
  const putToS3 = async (url: string, file: File, contentType: string) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType || "application/octet-stream",
      },
      body: file,
      credentials: "omit",
      mode: "cors",
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(`S3 PUT failed: ${res.status} ${msg}`);
    }
  };

  // 🧩 presign → PUT (도메인: artist)
  const uploadImage = async (file: File): Promise<string> => {
    const presignRes = await api.post("/api/uploads/presign", {
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      domain: "artist",
    });

    const { url, key } = presignRes.data as { url: string; key: string };

    try {
      await putToS3(url, file, file.type || "application/octet-stream");
      console.log(`PUT 완료: ${file.name}`);
      return key;
    } catch (err) {
      console.error(` PUT 실패: ${file.name}`, err);
      throw err;
    }
  };

  //  등록 버튼 클릭 시
  const handleSubmit = async () => {
    if (!artistName || !ImageTmpKey || !birthday) {
      alert("이미지, 아티스트 명, 생일을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const body = {
        nameKr: artistName,
        groupId: selectedGroup ? selectedGroup.id : null,
        groupName: selectedGroup ? null : groupName,
        ImageTmpKey,
        birthDate: birthday || null,
      };
      await api.post("/api/artists", body);

      openAlert("아티스트 등록이 완료되었어요.");
    } catch (error) {
      console.error(error);
      openAlert("등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <Topbar
        _leftImage={<Backward onClick={handleBackRouter} />}
        _topNode="아티스트 등록"
      />

      <div className="px-[24px] pt-[36px]">
        <div className="flex flex-col justify-center items-center mb-[24px]">
          {/* 이미지 업로드 */}
          <div className="items-center justify-center flex flex-col">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div
              onClick={handleImageClick}
              className="rounded-full border border-divider-1 flex justify-center items-center w-[72px] h-[72px] hover:cursor-pointer"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt={preview}
                  className="object-cover w-full h-full overflow-hidden"
                  width={72}
                  height={72}
                />
              ) : (
                <RoundChecker />
              )}
            </div>
            <p className="text-[10px] font-[400] text-text-3 mt-[8px]">
              아티스트 프로필 사진을 등록해주세요.
            </p>
          </div>

          {/* 아티스트명 */}
          <div className="mt-4">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              아티스트 명 *
            </p>
            <Input
              _value={artistName}
              _state="textbox-basic"
              _onChange={setArtistName}
            />
          </div>

          {/* 그룹명 + 검색 */}
          <div className="mt-4 relative w-full">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              그룹 명
            </p>
            <Input
              _value={inputGroupName}
              _state="textbox-basic"
              _onChange={handleGroupInputChange}
            />

            {groupResults.length > 0 && (
              <div className="absolute z-10 bg-white border border-divider-1 rounded-[6px] w-full mt-1 shadow-sm max-h-[160px] overflow-y-auto">
                {groupResults.map((group) => (
                  <div
                    key={group.id}
                    className="px-3 py-2 text-[14px] hover:bg-secondary-200 cursor-pointer flex items-center gap-2"
                    onClick={() => handleSelectGroup(group)}
                  >
                    {group.imageUrl && (
                      <Image
                        width={24}
                        height={24}
                        src={group.imageUrl}
                        alt={group.nameKr}
                        className="object-cover rounded-full overflow-hidden"
                      />
                    )}
                    <span>{group.nameKr}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 생일 */}
          <div className="mt-[16px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              생일 *
            </p>
            <Input
              _value={birthday}
              _state="textbox-basic"
              _inputProps={{ type: "date" }}
              _onChange={setBirthday}
            />
          </div>

          <div className="h-[1px] bg-divider-1 w-full mt-[32px]" />
          <p className="w-full text-text-3 font-[400] text-[12px] mb-[48px] mt-[6px]">
            * 표시는 필수 입력 항목입니다.
          </p>
        </div>
        {/* 안내문 */}
        <div className="flex flex-col bg-secondary-300 w-[327.5px] rounded-[8px] h-[152px] p-[20px] mb-[62px]">
          <div className="flex w-full justify-start items-center gap-[6px] pb-[4px]">
            <div className="flex justify-center items-center rounded-xl w-[14px] h-[14px] bg-primary text-secondary-300 font-[600] text-[12px]">
              !
            </div>
            <p className="text-text-5 text-[14px] font-[600]">
              아티스트 등록 시 유의 사항
            </p>
          </div>
          <p className="text-text-4 text-[12px] font-[400]">
            {`· 등록한 아티스트 확인은 [마이>내 아티스트] 에서 확인하실 수 있습니다.`}
          </p>
          <p className="text-primary text-[12px] font-[400]">
            · 아티스트 등록 및 진행에 관하여 발생된 모든 문제는 디어위드에서
            책임지지 않습니다.
          </p>
        </div>

        <Button
          _state="main"
          _node={isSubmitting ? "등록 중" : "아티스트 등록하기"}
          _onClick={handleSubmit}
          _buttonProps={{
            className: "mt-6 bg-[#FD725C] hover:cursor-pointer",
            disabled: isSubmitting,
          }}
        />
      </div>
    </div>
  );
};

export default Page;
