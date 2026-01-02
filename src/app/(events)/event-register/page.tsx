"use client";
import { getArtist, getRoadName, getEventDetail, patchEvent } from "@/apis/api";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Topbar from "@/components/template/Topbar";
import Bottombar from "@/components/template/Bottombar";
import Backward from "@/svgs/Backward.svg";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import { BASE_URL } from "@/app/routePath";
import Image from "next/image";
import dayjs from "dayjs";
import { useXAuthStore } from "../../stores/useXAuthStore";
import useModalStore from "../../stores/useModalStore";
import api from "@/apis/instance";
import { AxiosError } from "axios";
import Reference from "@/svgs/Reference.svg";
import Gallery from "@/svgs/Gallery.svg";
import Checker from "@/svgs/Checker.svg";
import Close from "@/svgs/Close.svg";
import TagCancel from "@/svgs/TagCancel.svg";
import SearchProfileBasic from "@/svgs/SearchProfileBasic.svg";
import Forward from "@/svgs/Forward.svg";
import Check from "@/svgs/Check.svg";
import Spinner from "@/components/Spinner/Spinner";
import type { EventDetail } from "@/app/(events)/event-detail/[id]/page";

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

const EventRegisterContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editEventId = searchParams?.get("edit");
  const { handle, isVerified, ticket, setAuthData, setVerified } = useXAuthStore();
  const { openAlert } = useModalStore();
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
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [xLink, setXLink] = useState("");
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
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [existingImages, setExistingImages] = useState<{ id: string; url: string; displayOrder: number }[]>([]);

  const getAllBenefits = (
    basicTags: string[],
    firstTags: string[],
    startDate: string // YYYY-MM-DD
  ): Benefit[] => {
    const all: Benefit[] = [];

    // 기본특전
    basicTags.forEach((tag, i) =>{
      const dayIndex = i + 1;
      if (dayIndex < 1) throw new Error("dayIndex must be >= 1");

      const visibleFrom = dayjs(startDate)
        .add(dayIndex - 1, "day")
        .format("YYYY-MM-DD");
      all.push({
        name: tag,
        benefitType: "INCLUDED",
        dayIndex: 1, // 기본특전은 항상 1
        displayOrder: i + 1,
        visibleFrom,
      })
  });

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
    if (tags.includes(trimmed)) return openAlert("이미 추가된 항목입니다.");
    if (tags.length >= 10)
      return openAlert("최대 10개까지만 등록할 수 있습니다.");
    setTags([...tags, trimmed]);
    setInput("");
  };

  const handleDateInput =
    (setter: (v: string) => void) => (value: string) => {
      // 숫자만 추출 후 최대 8자리(yyyyMMdd)까지 허용
      const digits = value.replace(/\D/g, "").slice(0, 8);
      let formatted = digits;

      if (digits.length > 4 && digits.length <= 6) {
        // yyyy.mm
        formatted = `${digits.slice(0, 4)}.${digits.slice(4)}`;
      } else if (digits.length > 6) {
        // yyyy.mm.dd
        formatted = `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(
          6,
          8
        )}`;
      }

      setter(formatted);
    };

  const handleTimeInput =
    (setter: (v: string) => void) => (value: string) => {
      const digits = value.replace(/\D/g, "").slice(0, 4); // HHmm
      if (!digits) {
        setter("");
        return;
      }
      if (digits.length <= 2) {
        setter(digits);
        return;
      }
      setter(`${digits.slice(0, 2)}:${digits.slice(2)}`); // HH.mm
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
      // 한글 IME 조합 중 엔터 입력은 무시 (중복/깨짐 방지)
      const isComposing =
        (e.nativeEvent as unknown as { isComposing?: boolean }).isComposing;
      if (isComposing) return;
      e.preventDefault();
      handleAddTag(input, setInput, tags, setTags);
    }
  };

  // X handle 표시
  useEffect(() => {
    if (handle) console.log("인증된 핸들:", handle);
  }, [handle]);

  // 수정 모드: 기존 이벤트 데이터 불러오기
  useEffect(() => {
    if (!editEventId) return;

    const loadEventData = async () => {
      try {
        setIsLoadingEvent(true);
        const eventData: EventDetail = await getEventDetail(editEventId);

        // 기본 정보
        setTitle(eventData.title || "");
        setStartDate(eventData.startDate ? eventData.startDate.replace(/-/g, ".") : "");
        setEndDate(eventData.endDate ? eventData.endDate.replace(/-/g, ".") : "");
        setOpenTime(eventData.openTime || "");
        setCloseTime(eventData.closeTime || "");

        // 아티스트 설정
        if (eventData.artists && eventData.artists.length > 0) {
          const artist = eventData.artists[0];
          setSelectedArtist({
            id: artist.id,
            nameKr: artist.nameKr,
            groupName: "",
            imageUrl: artist.profileImageUrl || "",
          });
          setInputArtist(artist.nameKr);
        } else if (eventData.artistGroups && eventData.artistGroups.length > 0) {
          // 그룹이 있는 경우 처리 (필요시)
        }

        // 장소 설정
        if (eventData.place) {
          const address = eventData.place.roadAddress || eventData.place.jibunAddress || "";
          const place: Place = {
            id: eventData.place.kakaoPlaceId,
            place_name: eventData.place.name,
            address_name: address,
            road_address_name: eventData.place.roadAddress || undefined,
            x: eventData.place.lon,
            y: eventData.place.lat,
          };
          setSelectedPlace(place);
          setInputRoadName(address);
          setCafeName(eventData.place.name);
        }

        // 특전 설정
        if (eventData.benefits) {
          const included = eventData.benefits
            .filter((b: EventDetail["benefits"][0]) => b.benefitType === "INCLUDED")
            .map((b: EventDetail["benefits"][0]) => b.name);
          const limited = eventData.benefits
            .filter((b: EventDetail["benefits"][0]) => b.benefitType === "LIMITED")
            .map((b: EventDetail["benefits"][0]) => b.name);
          setBasicTags(included);
          setFirstTags(limited);
        }

        // 이미지 설정
        if (eventData.images && eventData.images.length > 0) {
          const imageData = eventData.images.map((img: EventDetail["images"][0], idx: number) => ({
            id: img.id,
            url: img.variants?.[0]?.url || "",
            displayOrder: idx,
          }));
          setExistingImages(imageData);
          setImagePreviews(imageData.map((img: { url: string }) => img.url));
        }

        // 주최자 정보
        if (eventData.organizer) {
          setIsOrganizer(eventData.organizer.verified);
          
          // X 인증 정보가 있으면 인증 상태 설정
          if (eventData.organizer.verified && eventData.organizer.xHandle) {
            setAuthData({
              result: "success",
              ticket: "", // 수정 모드에서는 ticket이 없을 수 있음
              handle: eventData.organizer.xHandle,
            });
            setVerified(true);
          }
        }
      } catch (err) {
        console.error("이벤트 데이터 로드 실패:", err);
        openAlert("이벤트 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoadingEvent(false);
      }
    };

    loadEventData();
  }, [editEventId, openAlert, setAuthData, setVerified]);

  const handleXLogin = () => {
    router.push(`http://${BASE_URL}/oauth2/x/authorize`);
  };

  // 파일 선택 버튼 클릭 시 input 트리거
  const handleGalleryClick = () => {
    const totalImages = existingImages.length + imageFiles.length;
    if (totalImages >= 5) {
      openAlert("최대 5개의 이미지만 업로드할 수 있습니다.");
      return;
    }
    fileInputRef.current?.click();
  };

  // 파일 선택 후 이미지 미리보기 등록
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files);
    const totalCount = existingImages.length + imageFiles.length + selected.length;

    if (totalCount > 5) {
      openAlert("최대 5개의 이미지만 등록할 수 있습니다.");
      return;
    }

    const allowed = selected.filter((file) => {
      const ok = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
      if (!ok) openAlert("jpg, jpeg, png 형식의 이미지만 업로드 가능합니다.");
      return ok;
    });

    if (!allowed.length) return;

    const newPreviews = allowed.map((file) => URL.createObjectURL(file));

    // File과 URL 둘 다 추가
    setImageFiles((prev) => [...prev, ...allowed]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // 이미지 삭제
  const handleRemoveImage = (idx: number) => {
    // 기존 이미지인지 새 이미지인지 확인
    if (idx < existingImages.length) {
      // 기존 이미지 삭제
      setExistingImages((prev) => prev.filter((_, i) => i !== idx));
      setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    } else {
      // 새 이미지 삭제
      const newIdx = idx - existingImages.length;
      setImageFiles((prev) => prev.filter((_, i) => i !== newIdx));
      setImagePreviews((prev) => {
        const existing = prev.slice(0, existingImages.length);
        const newPreviews = prev.slice(existingImages.length);
        return [...existing, ...newPreviews.filter((_, i) => i !== newIdx)];
      });
    }
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
    const startOrder = existingImages.length;

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
          displayOrder: startOrder + idx,
        });

        console.log(`PUT 완료: ${file.name}`);
      } catch (err) {
        console.error(`❌ PUT 실패: ${file.name}`, err);
        openAlert(`이미지 업로드 실패: ${file.name}`);
      }
    }

    return uploaded;
  };

  // 아티스트 검색
  const handleArtistChange = (v: string) => {
    setSelectedArtist(null); // 새로 입력 시 선택값 해제
    setInputArtist(v);
    if (!v.trim()) setArtistResults([]);
  };

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

  const isValidXLink = xLink.startsWith("https://x.com/");

  // 이벤트 등록/수정
  const handleSubmit = async () => {
    // 수정 모드가 아닐 때만 ticket 체크 (수정 모드에서는 organizer 정보가 이미 있으므로 ticket이 없어도 됨)
    if (!editEventId && isVerified === true && !ticket) {
      return openAlert("X 인증이 필요합니다.");
    }
    if (!selectedArtist || !selectedPlace)
      return openAlert("아티스트와 장소를 선택해주세요.");
    if (isOrganizer === null) return openAlert("주최자 여부를 선택해주세요.");
    // 주최자일 때는 X 계정 인증 필수
    if (isOrganizer === true && !isVerified) {
      return openAlert("주최자는 X 계정 인증이 필수입니다.");
    }

    try {
      setIsSubmitting(true);
      const newImgs = await uploadImages(imageFiles);

      const normalizeDate = (date: string) => date.replace(/\./g, "-");
      const normalizeTime = (time: string) => time.replace(/\./g, ":");

      // 이미지 구성: 기존 이미지 + 새 이미지
      const imagePayload = [
        ...existingImages.map((img) => ({
          id: img.id,
          displayOrder: img.displayOrder,
        })),
        ...newImgs.map((img, idx) => ({
          tmpKey: img.tmpKey,
          displayOrder: existingImages.length + idx,
        })),
      ];

      const body = {
        title,
        startDate: normalizeDate(startDate),
        endDate: normalizeDate(endDate),
        openTime: normalizeTime(openTime),
        closeTime: normalizeTime(closeTime),
        xLink: isOrganizer === false && isValidXLink ? xLink : null,
        artistIds: [selectedArtist.id],
        place: {
          kakaoPlaceId: selectedPlace.id,
          name: selectedPlace.place_name,
          roadAddress: selectedPlace.road_address_name || "",
          jibunAddress: selectedPlace.address_name,
          lon: selectedPlace.x ?? 0,
          lat: selectedPlace.y ?? 0,
          phone: selectedPlace.phone ?? "",
          placeUrl: selectedPlace.place_url ?? "",
        },
        images: imagePayload,
        benefits: getAllBenefits(basicTags, firstTags, normalizeDate(startDate)),
      };

      if (editEventId) {
        // 수정 모드
        await patchEvent(editEventId, body);
        openAlert("이벤트 수정이 완료되었습니다.");
        router.push(`/event-detail/${editEventId}`);
      } else {
        // 등록 모드
        const res = await api.post("/api/events", {
          ...body,
          organizer: {
            verified: isOrganizer,
            xHandle: handle,
            xTicket: ticket,
          },
        });
        const eventId = res.data?.id;
        if (eventId) {
          openAlert("이벤트 등록이 완료되었습니다.");
          router.push(`/event-detail/${eventId}`);
        } else {
          openAlert("이벤트 등록이 완료되었습니다.");
          router.push("/main");
        }
      }
    } catch (err) {
      console.error(err);
      const axiosError = err as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || 
                          axiosError?.response?.data?.detail || 
                          (editEventId ? "이벤트 수정 중 오류가 발생했습니다." : "이벤트 등록 중 오류가 발생했습니다.");
      openAlert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="flex flex-col justify-center w-full overflow-x-hidden">
        <Topbar
          _leftImage={<Backward onClick={handleBackRouter} />}
          _topNode={editEventId ? "이벤트 수정" : "이벤트 등록"}
        />
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center w-full overflow-x-hidden">
      <Topbar
        _leftImage={<Backward onClick={handleBackRouter} />}
        _topNode={editEventId ? "이벤트 수정" : "이벤트 등록"}
      />
      <div className="px-[24px] pt-[36px] w-full max-w-full overflow-x-hidden">
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
                className: `hover:cursor-pointer w-full ${
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
                className: `hover:cursor-pointer w-full ${
                  isOrganizer === false
                    ? "bg-[#FD725C] text-white"
                    : "bg-bg-1 text-[#FD725C] border-[1px] border-[#FD725C]"
                }`,
              }}
            />
          </div>

          <div className="mt-4 w-full">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              주최자 X 계정
              {isOrganizer === true && (
                <span className="text-text-5 ml-[4px]">*</span>
              )}
            </p>
            <div className="flex gap-[8px] w-full">
              <Input
                _value={handle || ""}
                _state="textbox-basic"
                _containerProps={{ className: "flex-1 min-w-0" }}
                _wrapperProps={{ className: "w-full" }}
                _leftNode={<span className="text-text-3 text-[14px] font-[400]">@</span>}
                _bottomNode={
                  isVerified
                    ? ""
                    : isOrganizer === true
                    ? "주최자는 X 계정 인증이 필수입니다."
                    : "X 계정을 인증해주세요."
                }
              />

              <Button
                _state="main"
                _node={isVerified ? "인증완료" : "인증하기"}
                _onClick={handleXLogin}
                _buttonProps={{
                  className: `p-[10px] w-[88px] ${
                    isVerified
                      ? "bg-bg-2 text-text-4"
                      : "bg-[#FD725C] text-white"
                  } hover:cursor-pointer`,
                  disabled: isSubmitting,
                }}
              />
            </div>
            {isOrganizer === false && (
              <div className="mt-[12px] w-full">
                <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
                  X 링크 <span className="text-text-3 text-[12px] font-[400]">(선택)</span>
                </p>
                <Input
                  _value={xLink}
                  _state="textbox-basic"
                  _onChange={setXLink}
                  _containerProps={{ className: "w-full" }}
                  _wrapperProps={{ className: "w-full" }}
                  _inputProps={{
                    placeholder: "X 계정 링크를 입력해주세요.",
                  }}
                  _bottomNode={
                    xLink && !isValidXLink
                      ? "X 계정 링크를 다시 입력해주세요."
                      : ""
                  }
                  _rightNode={isValidXLink ? <Check /> : undefined}
                />
              </div>
            )}
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
          <div className="mt-4 w-full relative">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              아티스트 명
            </p>
            <Input
              _value={inputArtist}
              _state="textbox-basic"
              _onChange={handleArtistChange}
            />
            {artistResults.length > 0 && (
              <ul className="absolute left-0 top-full w-full border mt-1 rounded bg-white z-20 max-h-[240px] overflow-y-auto shadow-md">
                {artistResults.map((a) => (
                  <li
                    key={a.id}
                    onClick={() => handleArtistSelect(a)}
                    className="flex justify-between w-full items-center cursor-pointer px-[16px] py-[10px] hover:bg-gray-100 gap-[12px]"
                  >
                    <div className="flex items-center gap-[12px]">
                      <div className="flex justify-center items-center w-[40px] h-[40px] rounded-full overflow-hidden">
                        {a.imageUrl ? (
                          <Image
                            src={a.imageUrl.trim()}
                            alt={a.nameKr}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <SearchProfileBasic />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[14px] font-[600] text-text-5">
                          {a.nameKr}
                        </p>
                        <p className="text-[12px] font-[400] text-text-4">
                          {a.groupName}
                        </p>
                      </div>
                    </div>
                    <Forward />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 w-full">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              이벤트 명
            </p>
            <Input _value={title} _state="textbox-basic" _onChange={setTitle} />
          </div>

          <div className="mt-4 w-full">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              이벤트 기간
            </p>
            <div className="flex items-center gap-2 w-full">
              <Input
                _value={startDate}
                _state="textbox-basic"
                _containerProps={{ className: "flex-1 min-w-0" }}
                _wrapperProps={{ className: "w-full" }}
                _inputProps={{
                  placeholder: "yyyy.mm.dd",
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 10,
                }}
                _onChange={handleDateInput(setStartDate)}
              />
              <span className="text-text-5 text-[14px] font-[500]">-</span>
              <Input
                _value={endDate}
                _state="textbox-basic"
                _containerProps={{ className: "flex-1 min-w-0" }}
                _wrapperProps={{ className: "w-full" }}
                _inputProps={{
                  placeholder: "yyyy.mm.dd",
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 10,
                }}
                _onChange={handleDateInput(setEndDate)}
              />
            </div>
          </div>

          <div className="mt-4 w-full">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              이벤트 운영 시간
            </p>
            <div className="flex items-center gap-2 w-full">
              <Input
                _value={openTime}
                _state="textbox-basic"
                _containerProps={{ className: "flex-1 min-w-0" }}
                _wrapperProps={{ className: "w-full" }}
                _inputProps={{
                  placeholder: "00:00",
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 5,
                }}
                _onChange={handleTimeInput(setOpenTime)}
              />
              <span className="text-text-5 text-[14px] font-[500]">-</span>
              <Input
                _value={closeTime}
                _state="textbox-basic"
                _containerProps={{ className: "flex-1 min-w-0" }}
                _wrapperProps={{ className: "w-full" }}
                _inputProps={{
                  placeholder: "00:00",
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 5,
                }}
                _onChange={handleTimeInput(setCloseTime)}
              />
            </div>
          </div>

          {/* 장소 */}
          <div className="mt-4 w-full">
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
          <div className="mt-4 w-full">
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
          <div className="mt-4 mb-[12px] w-full overflow-hidden">
            <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
              이미지
            </p>
            {/* padding 영역에 가려져도 스크롤 되도록 좌우 여백을 풀고 다시 채움 */}
            <div className="w-full overflow-x-auto scrollbar-hide touch-pan-x -mx-[24px] px-[24px]">
              {/* 숨겨진 파일 input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="flex gap-[8px] min-w-max whitespace-nowrap pr-[4px]">
                {/* 이미지 업로드 버튼 */}
                <div
                  onClick={handleGalleryClick}
                  className="rounded-[4px] border-1 border-divider-1 flex flex-col justify-center items-center w-[60px] h-[60px] hover:cursor-pointer shrink-0"
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
                      className="relative w-[60px] h-[60px] rounded-[4px] border-1 border-divider-1 flex justify-center items-center overflow-hidden bg-[#F9F9F9] shrink-0"
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

          <div className="flex flex-col bg-secondary-300 w-full rounded-[8px] p-[16px] mb-[48px]">
            <p className="text-text-4 text-[12px] font-[400]">
            · jpg, jpeg, png 형식의 이미지만 업로드 가능합니다.
            </p>
            <p className="text-text-4 text-[12px] font-[400]">
            · 첫 번째 이미지는 썸네일로 등록됩니다.
            </p>
            <p className="text-text-4 text-[12px] font-[400]">
            · 권장 크기 : 가로 375px / 세로 536px
            </p>
          </div>
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
          <div className="mt-4 w-full">
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
              <div key={title} className="mt-4 w-full">
                <p className="text-text-5 text-[14px] font-[600] mb-[6px]">
                  {title}
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <Input
                    _value={value}
                    _state="textbox-basic"
                    _onChange={setValue}
                    _wrapperProps={{ className: "w-full" }}
                    _inputProps={{
                      placeholder: `${title}을 입력해주세요. (최대 10개)`,
                      className: "placeholder:text-text-3",
                      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
                        handleKeyDown(e, value, setValue, tags, setTags),
                    }}
                  />
                  <div className="flex flex-col gap-[8px]">
                    {tags.map((tag, idx) => (
                      <div
                        key={`${title}-${tag}-${idx}`}
                        className="bg-white w-full h-[44px] text-text-5 text-[14px] font-[400] rounded-[4px] border-[1px] border-divider-1 flex justify-between items-center p-[10px]"
                      >
                        <span className="truncate">{tag}</span>
                        <button onClick={() => handleRemoveTag(idx, tags, setTags)}>
                          <TagCancel />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    _state="main"
                    _node="+ 추가하기"
                    _onClick={() => handleAddTag(value, setValue, tags, setTags)}
                    _buttonProps={{
                      className: "bg-[#FD725C] text-white w-full mt-[12px]",
                      disabled: isSubmitting,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-secondary-300 w-full rounded-[8px] p-[16px] mb-[48px] mt-[120px]">
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
      </div>
      {isSubmitting && <Spinner />}
      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node={editEventId ? "이벤트 수정하기" : "이벤트 등록하기"}
            _onClick={handleSubmit}
            _buttonProps={{
              className: "hover:cursor-pointer w-full",
              disabled: isSubmitting,
            }}
          />
        }
      />
    </div>
  );
};


const Page = () => {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center w-full overflow-x-hidden">
        <Topbar
          _leftImage={<Backward onClick={() => {}} />}
          _topNode="이벤트 등록"
        />
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      </div>
    }>
      <EventRegisterContent />
    </Suspense>
  );
};
export default Page;

// 이벤트 수정 요청 타입
export interface PatchEventData {
  title?: string;
  startDate?: string;
  endDate?: string;
  openTime?: string;
  closeTime?: string;
  xLink?: string | null;
  artistIds?: number[];
  artistGroupIds?: number[];
  place?: {
    kakaoPlaceId: string;
    name: string;
    roadAddress: string;
    jibunAddress: string;
    lon: number;
    lat: number;
    phone?: string;
    placeUrl?: string;
  };
  images?: Array<{
    id?: string;
    tmpKey?: string;
    displayOrder: number;
  }>;
  benefits?: Array<{
    name: string;
    benefitType: "INCLUDED" | "LIMITED" | "LUCKY_DRAW";
    dayIndex?: number | null;
    displayOrder: number;
    visibleFrom?: string;
  }>;
}
