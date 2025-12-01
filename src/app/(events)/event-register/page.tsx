"use client";
import { getArtist, getRoadName } from "@/apis/api";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "@/app/routePath";
import Image from "next/image";
import dayjs from "dayjs";
import { useXAuthStore } from "../../stores/useXAuthStore";
import api from "@/apis/instance";
import Reference from "@/svgs/Reference.svg";
import Gallery from "@/svgs/Gallery.svg";
import Checker from "@/svgs/Checker.svg";
import Close from "@/svgs/Close.svg";

interface Benefit {
  name: string;
  benefitType: "INCLUDED" | "LUCKY_DRAW" | "LIMITED";
  dayIndex: number | null;
  displayOrder: number;
  visibleFrom?: string;
}

interface Place {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name?: string;
  x?: number;
  y?: number;
  phone?: string;
  place_url?: string;
}

interface Artist {
  id: number;
  nameKr: string;
  groupName: string;
  imageUrl: string;
}

interface UploadedImage {
  tmpKey: string;
  url: string;
  displayOrder: number;
}

const Page = () => {
  const router = useRouter();
  const { handle, isVerified, ticket } = useXAuthStore();
  const handleBackRouter = () => router.back();

  const [inputArtist, setInputArtist] = useState("");
  const [artistResults, setArtistResults] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const [inputRoadName, setInputRoadName] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]); // 실제 업로드용 파일들
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // 미리보기용 URL

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isOrganizer, setIsOrganizer] = useState(true);
  const [cafeName, setCafeName] = useState("");

  const [basicInput, setBasicInput] = useState("");
  const [firstInput, setFirstInput] = useState("");

  const [basicTags, setBasicTags] = useState<string[]>([]);
  const [firstTags, setFirstTags] = useState<string[]>([]);

  const getAllBenefits = (
    basicTags: string[],
    firstTags: string[],
    startDate: string // YYYY-MM-DD
  ): Benefit[] => {
    const all: Benefit[] = [];

    // 기본특전
    basicTags.forEach((tag, i) =>
      all.push({
        name: tag,
        benefitType: "INCLUDED",
        dayIndex: 1, // 기본특전은 항상 1
        displayOrder: i + 1,
        visibleFrom: startDate,
      })
    );

    // 일별 선착순 특전 (LIMITED)
    firstTags.forEach((tag, i) => {
      const dayIndex = i + 1;
      if (dayIndex < 1) throw new Error("dayIndex must be >= 1");

      const visibleFrom = dayjs(startDate)
        .add(dayIndex - 1, "day")
        .format("YYYY-MM-DD");

      all.push({
        name: tag,
        benefitType: "LIMITED",
        dayIndex,
        displayOrder: i + 1,
        visibleFrom,
      });
    });

    return all;
  };

  // 공용 함수: 입력값을 해당 태그 배열에 추가
  const handleAddTag = (
    input: string,
    setInput: (v: string) => void,
    tags: string[],
    setTags: (v: string[]) => void
  ) => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return alert("이미 추가된 항목입니다.");
    if (tags.length >= 5) return alert("최대 5개까지만 등록할 수 있습니다.");
    setTags([...tags, trimmed]);
    setInput("");
  };

  // 태그 삭제 함수
  const handleRemoveTag = (
    idx: number,
    tags: string[],
    setTags: (v: string[]) => void
  ) => {
    const updated = tags.filter((_, i) => i !== idx);
    setTags(updated);
  };

  // 공용 함수: Enter 키로도 등록 가능
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    input: string,
    setInput: (v: string) => void,
    tags: string[],
    setTags: (v: string[]) => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(input, setInput, tags, setTags);
    }
  };

  // X handle 표시
  useEffect(() => {
    if (handle) console.log("인증된 핸들:", handle);
  }, [handle]);

  const handleXLogin = () => {
    router.push(`http://${BASE_URL}/oauth2/x/authorize`);
  };

  // 파일 선택 버튼 클릭 시 input 트리거
  const handleGalleryClick = () => {
    if (imageFiles.length >= 5) {
      alert("최대 5개의 이미지만 업로드할 수 있습니다.");
      return;
    }
    fileInputRef.current?.click();
  };

  // 파일 선택 후 이미지 미리보기 등록
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files);
    const totalCount = imageFiles.length + selected.length;

    if (totalCount > 5) {
      alert("최대 5개의 이미지만 등록할 수 있습니다.");
      return;
    }

    const newPreviews = selected.map((file) => URL.createObjectURL(file));

    // File과 URL 둘 다 추가
    setImageFiles((prev) => [...prev, ...selected]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // 이미지 삭제
  const handleRemoveImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const putToS3 = async (url: string, file: File, contentType: string) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType || "application/octet-stream",
      },
      body: file,
      credentials: "omit", // 중요: S3엔 쿠키 절대 안 보냄
      mode: "cors",
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(`S3 PUT failed: ${res.status} ${msg}`);
    }
  };

  const uploadImages = async (images: File[]): Promise<UploadedImage[]> => {
    if (!images.length) return [];

    const uploaded: UploadedImage[] = [];

    for (let idx = 0; idx < images.length; idx++) {
      const file = images[idx];

      // 1️⃣ presigned URL 발급
      const presignRes = await api.post("/api/uploads/presign", {
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        domain: "event",
      });

      const { url, key } = presignRes.data as { url: string; key: string };

      try {
        // 2️⃣ S3에 PUT
        await putToS3(url, file, file.type || "application/octet-stream");

        uploaded.push({
          tmpKey: key,
          url,
          displayOrder: idx,
        });

        console.log(`PUT 완료: ${file.name}`);
      } catch (err) {
        console.error(`❌ PUT 실패: ${file.name}`, err);
        alert(`이미지 업로드 실패: ${file.name}`);
      }
    }

    return uploaded;
  };

  // 아티스트 검색
  const handleArtistChange = (v: string) => setInputArtist(v);

  useEffect(() => {
    if (!inputArtist.trim() || selectedArtist) return;
    const t = setTimeout(async () => {
      const data = await getArtist(inputArtist);
      setArtistResults(data);
    }, 300);
    return () => clearTimeout(t);
  }, [inputArtist, selectedArtist]);

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
    setInputArtist(artist.nameKr);
    setArtistResults([]);
  };

  // 장소 검색
  const handleRoadNameChange = (v: string) => {
    setInputRoadName(v);
    setSelectedPlace(null);
  };

  useEffect(() => {
    if (!inputRoadName.trim() || selectedPlace) return;
    const t = setTimeout(async () => {
      const data = await getRoadName(inputRoadName);
      setResults(data);
    }, 300);
    return () => clearTimeout(t);
  }, [inputRoadName, selectedPlace]);

  const handleSelect = (place: Place) => {
    setSelectedPlace(place);
    setInputRoadName(place.address_name);
    setCafeName(place.place_name);
    setResults([]);
  };

  // 이벤트 등록
  const handleSubmit = async () => {
    if (!isVerified || !ticket) return alert("X 인증이 필요합니다.");
    if (!selectedArtist || !selectedPlace)
      return alert("아티스트와 장소를 선택해주세요.");
    if (isOrganizer === null) return alert("주최자 여부를 선택해주세요.");

    try {
      setIsSubmitting(true);
      const imgs = await uploadImages(imageFiles);

      const body = {
        title,
        startDate,
        endDate,
        artistIds: [selectedArtist.id],
        place: {
          kakaoPlaceId: selectedPlace.id,
          name: selectedPlace.place_name,
          roadAddress:
            selectedPlace.road_address_name ?? selectedPlace.address_name,
          jibunAddress: selectedPlace.address_name,
          lon: selectedPlace.x ?? 0,
          lat: selectedPlace.y ?? 0,
          phone: selectedPlace.phone ?? "",
          placeUrl: selectedPlace.place_url ?? "",
        },
        images: imgs.map((img) => ({
          tmpKey: img.tmpKey,
          displayOrder: img.displayOrder,
        })),
        benefits: getAllBenefits(basicTags, firstTags, startDate),
        organizer: {
          verified: isOrganizer,
          xHandle: handle,
          xTicket: ticket,
        },
      };

      await api.post("/api/events", body);
      alert(`이벤트 등록이 완료되었습니다.`);
    } catch (err) {
      console.error(err);
      alert("이벤트 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <Topbar
        _leftImage={<Backward onClick={handleBackRouter} />}
        _topNode="이벤트 등록"
      />
      <div className="px-[24px] pt-[36px]">
        <div className="flex flex-col justity-center items-start mb-[24px]">
          <div className="flex justify-center items-center gap-[6px] mb-[20px]">
            <div className="flex justify-center items-center rounded-xl w-[16px] h-[16px] bg-primary text-text-1 font-[600] text-[12px]">
              1
            </div>
            <h3 className="text-text-5 text-[16px] font-[700]">
              주최자 정보를 입력해주세요
            </h3>
          </div>
          <div className="flex items-center gap-[2px] mb-[6px]">
            <p className="text-text-5 text-[14px] font-[600]">주최자 여부</p>
            <Reference />
          </div>

          <div className="flex gap-[8px] w-full">
            <Button
              _state="main"
              _node="주최자 입니다."
              _onClick={() => setIsOrganizer(true)}
              _buttonProps={{
                className: `hover:cursor-pointer w-[160px] ${
                  isOrganizer === true
                    ? "bg-[#FD725C] text-white"
                    : "bg-bg-1 text-[#FD725C] border-[1px] border-[#FD725C]"
                }`,
              }}
            />
            <Button
              _state="main"
              _node="주최자가 아닙니다."
              _onClick={() => setIsOrganizer(false)}
              _buttonProps={{
                className: `hover:cursor-pointer w-[160px] ${
                  isOrganizer === false
                    ? "bg-[#FD725C] text-white"
                    : "bg-bg-1 text-[#FD725C] border-[1px] border-[#FD725C]"
                }`,
              }}
            />
          </div>

          <div className="mt-4">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              주최자 트위터 계정
            </p>
            <Input
              _value={handle || ""}
              _state="textbox-basic"
              _bottomNode={isVerified ? "X계정 인증되었습니다." : ""}
              _inputProps={{ onClick: handleXLogin }}
            />
          </div>
        </div>

        <div className="flex flex-col justity-center items-start mb-[24px]">
          <div className="flex justify-center items-center gap-[6px] mt-[36px] mb-[20px]">
            <div className="flex justify-center items-center rounded-xl w-[16px] h-[16px] bg-primary text-text-1 font-[600] text-[12px]">
              2
            </div>
            <h3 className="text-text-5 text-[16px] font-[700]">
              이벤트 정보를 입력해주세요
            </h3>
          </div>

          {/* 아티스트 선택 */}
          <div>
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              아티스트 명
            </p>
            <Input
              _value={inputArtist}
              _state="textbox-basic"
              _onChange={handleArtistChange}
            />
            {artistResults.length > 0 && (
              <ul className="border mt-1 rounded bg-white">
                {artistResults.map((a) => (
                  <li
                    key={a.id}
                    onClick={() => handleArtistSelect(a)}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  >
                    <Image
                      src={a.imageUrl}
                      alt={a.nameKr}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {a.nameKr} ({a.groupName})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              이벤트 명
            </p>
            <Input _value={title} _state="textbox-basic" _onChange={setTitle} />
          </div>

          <div className="mt-4">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              이벤트 기간
            </p>
            <div className="flex flex-col gap-2">
              <Input
                _value={startDate}
                _state="textbox-basic"
                _inputProps={{ type: "date" }}
                _onChange={setStartDate}
              />
              <Input
                _value={endDate}
                _state="textbox-basic"
                _inputProps={{ type: "date" }}
                _onChange={setEndDate}
              />
            </div>
          </div>

          {/* 장소 */}
          <div className="mt-4">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">장소</p>
            <Input
              _value={inputRoadName}
              _state="textbox-basic"
              _onChange={handleRoadNameChange}
            />
            {results.length > 0 && (
              <ul className="border mt-1 rounded bg-white">
                {results.map((p) => (
                  <li
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {p.place_name} ({p.address_name})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 카페 명 */}
          <div className="mt-4">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              카페 명
            </p>
            <Input
              _value={cafeName}
              _state="textbox-basic"
              _onChange={setCafeName}
              _inputProps={{ disabled: !!selectedPlace }}
            />
          </div>

          {/* 이미지 업로드 */}
          <div className="mt-4 mb-[12px]">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              이미지
            </p>
            <div className="w-[327px] overflow-x-auto scrollbar-hide touch-pan-x">
              {/* 숨겨진 파일 input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="flex gap-[8px] min-w-max">
                {/* 이미지 업로드 버튼 */}
                <div
                  onClick={handleGalleryClick}
                  className="rounded-[4px] border-1 border-divider-1 flex flex-col justify-center items-center w-[60px] h-[60px] hover:cursor-pointer"
                >
                  <Gallery />
                  <p className="text-[10px] font-[400] text-text-5">
                    사진 ({imagePreviews.length}/5)
                  </p>
                </div>

                {/* 이미지 슬롯 (5개 고정) */}
                {Array.from({ length: 5 }).map((_, idx) => {
                  const image = imagePreviews[idx];
                  return (
                    <div
                      key={idx}
                      className="relative w-[60px] h-[60px] rounded-[4px] border-1 border-divider-1 flex justify-center items-center overflow-hidden bg-[#F9F9F9]"
                    >
                      {image ? (
                        <>
                          <Image
                            width={60}
                            height={60}
                            src={image}
                            alt={`uploaded-${idx}`}
                            className="object-cover"
                            onClick={() => handleRemoveImage(idx)}
                          />
                          <button
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-[0px] right-[0px] flex items-center justify-center"
                          >
                            <Close />
                          </button>
                        </>
                      ) : (
                        <Checker />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-divider-1 w-full mb-[6px]" />
          <p className="text-text-3 font-[400] text-[12px]">
            첫 번째 이미지는 썸네일로 등록됩니다.
            <br />
            권장 크기 : 가로 00px / 세로 00px
          </p>
        </div>

        <div className="flex flex-col justity-center items-start mb-[24px]">
          <div className="flex justify-center items-center gap-[6px] mt-[36px]">
            <div className="flex justify-center items-center rounded-xl w-[16px] h-[16px] bg-primary text-text-1 font-[600] text-[12px]">
              3
            </div>
            <h3 className="text-text-5 text-[16px] font-[700]">
              특전 및 상품 정보를 입력해주세요
            </h3>
          </div>

          {/* 특전 */}
          <div className="mt-4">
            {[
              {
                title: "기본특전",
                value: basicInput,
                tags: basicTags,
                setValue: setBasicInput,
                setTags: setBasicTags,
              },
              {
                title: "선착특전",
                value: firstInput,
                tags: firstTags,
                setValue: setFirstInput,
                setTags: setFirstTags,
              },
            ].map(({ title, value, tags, setValue, setTags }) => (
              <div key={title} className="mt-4">
                <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
                  {title}
                </p>
                <div className="flex gap-[8px] w-full">
                  <Input
                    _value={value}
                    _state="textbox-basic"
                    _onChange={setValue}
                    _wrapperProps={{ className: "w-[244px]" }}
                    _inputProps={{
                      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
                        handleKeyDown(e, value, setValue, tags, setTags),
                    }}
                  />
                  <Button
                    _state="main"
                    _node="등록하기"
                    _onClick={() =>
                      handleAddTag(value, setValue, tags, setTags)
                    }
                    _buttonProps={{
                      className:
                        "p-[10px] bg-[#FD725C] hover:cursor-pointer w-[75px]",
                      disabled: isSubmitting,
                    }}
                  />
                </div>

                {/* 태그 리스트 */}
                <div className="flex flex-row gap-[4px] w-full mt-[8px] flex-wrap">
                  {tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="px-[8px] py-[2px] bg-[#FFE5AF] text-[#FD725C] text-[11px] font-[600] rounded-[4px]"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(idx, tags, setTags)}
                        className="text-[#FD725C] font-[700] ml-[2px] hover:text-[#ff3b2f]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-secondary-300 w-[327.5px] rounded-[8px] h-[152px] p-[20px] mb-[48px]">
          <div className="flex w-full justify-start items-center gap-[6px] pb-[4px]">
            <div className="flex justify-center items-center rounded-xl w-[14px] h-[14px] bg-primary text-secondary-300 font-[600] text-[12px]">
              !
            </div>
            <p className="flex justify-center items-center text-text-5 text-[14px] font-[600]">
              이벤트 등록 시 유의 사항
            </p>
          </div>
          <p className="text-text-4 text-[12px] font-[400]">
            · 이벤트 기간은 최소 1일 이상입니다.
          </p>
          <p className="text-text-4 text-[12px] font-[400]">
            {`· 이벤트 예약 확인은 [마이>이벤트 관리] 에서 확인하실 수 있습니다.`}
          </p>
          <p className="text-primary text-[12px] font-[400]">
            · 이벤트 등록 및 진행에 관하여 발생된 모든 문제는 디어위드에서
            책임지지 않습니다.
          </p>
        </div>

        <Button
          _state="main"
          _node={isSubmitting ? "등록 중..." : "이벤트 등록하기"}
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
