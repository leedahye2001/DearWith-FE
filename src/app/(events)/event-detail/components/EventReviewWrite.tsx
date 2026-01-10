"use client";

import { patchEventReviewDetail, type PatchReviewData } from "@/apis/api";
import api from "@/apis/instance";
import useModalStore from "@/app/stores/useModalStore";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Spinner from "@/components/Spinner/Spinner";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import WriteTitle from "./WriteTitle";
import TagCancel from "@/svgs/TagCancel.svg";
import Close from "@/svgs/Close.svg";
import Checker from "@/svgs/Checker.svg";
import Bottombar from "@/components/template/Bottombar";
import { AxiosError } from "axios";

interface ReviewImage {
  id?: number;
  tmpKey?: string;
  url?: string;
  displayOrder: number;
}

interface ImageItem {
  id?: number; // 기존 이미지 ID
  file?: File; // 새 이미지 파일
  preview?: string; // 미리보기 URL
  displayOrder: number;
}

export interface ReviewDetail {
  id: string;
  content: string;
  tags: string[];
  images: ReviewImage[];
}

interface EventReviewWriteProps {
  eventId: string;
  reviewData?: ReviewDetail;
  onClose?: () => void;
}

export default function EventReviewWrite({
  eventId,
  reviewData,
  onClose,
}: EventReviewWriteProps) {
  const isEdit = Boolean(reviewData);

  const { openAlert } = useModalStore();

  const [content, setContent] = useState(reviewData?.content || "");
  const [tags, setTags] = useState<string[]>(reviewData?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [images, setImages] = useState<ImageItem[]>(
    reviewData?.images?.map((img, idx) => ({
      id: img.id,
      preview: img.url,
      displayOrder: idx,
    })) || []
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // reviewData가 변경될 때 state 업데이트
  useEffect(() => {
    if (reviewData) {
      setContent(reviewData.content || "");
      setTags(reviewData.tags || []);
      setImages(
        reviewData.images?.map((img, idx) => ({
          id: img.id,
          preview: img.url,
          displayOrder: idx,
        })) || []
      );
    }
  }, [reviewData]);

  // 태그 추가/삭제
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (tags.length >= 4)
      return openAlert("태그는 최대 4개까지 등록할 수 있어요.");
    setTags([...tags, newTag.trim()]);
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // 이미지 추가/삭제
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const selected = Array.from(files);
    const totalCount = images.length + selected.length;
    if (totalCount > 2)
      return openAlert("최대 2개의 이미지만 등록할 수 있어요.");
    
    const newImages: ImageItem[] = selected.map((file, idx) => ({
      file,
      preview: URL.createObjectURL(file),
      displayOrder: images.length + idx,
    }));
    
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = ""; // 같은 파일 다시 선택 가능하도록
  };

  const handleRemoveImage = (idx: number) => {
    const imageToRemove = images[idx];
    if (imageToRemove.preview && !imageToRemove.id) {
      // 새로 추가한 이미지의 preview URL 해제
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== idx);
      // displayOrder 재정렬
      return newImages.map((img, i) => ({ ...img, displayOrder: i }));
    });
  };

  // 이미지 업로드 (S3 Presigned URL)
  const putToS3 = async (url: string, file: File, contentType: string) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: file,
      credentials: "omit",
      mode: "cors",
    });
    if (!res.ok) throw new Error(`S3 PUT 실패: ${file.name}`);
  };

  const uploadNewImages = async (imageItems: ImageItem[]): Promise<{ tmpKey: string; displayOrder: number }[]> => {
    const newImageItems = imageItems.filter((img) => img.file && !img.id);
    if (!newImageItems.length) return [];
    
    const uploaded: { tmpKey: string; displayOrder: number }[] = [];
    for (const imageItem of newImageItems) {
      if (!imageItem.file) continue;
      const file = imageItem.file;
      const presignRes = await api.post("/api/uploads/presign", {
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        domain: "event",
      });
      const { url, key } = presignRes.data as { url: string; key: string };
      await putToS3(url, file, file.type || "application/octet-stream");
      uploaded.push({ tmpKey: key, displayOrder: imageItem.displayOrder });
    }
    return uploaded;
  };

  // 수정/등록 처리
  const handleSubmit = async () => {
    if (!content.trim() && !isEdit) return openAlert("리뷰를 작성해주세요.");
    try {
      setIsSubmitting(true);

      if (isEdit && reviewData) {
        // 새 이미지 업로드
        const newImageUploads = await uploadNewImages(images);
        
        // 최종 이미지 배열 구성 (기존 이미지 유지 + 새 이미지 추가)
        const finalImages = images.map((img) => {
          if (img.id) {
            // 기존 이미지 유지
            return {
              id: img.id,
              displayOrder: img.displayOrder,
            };
          } else {
            // 새 이미지 (업로드된 것 찾기)
            const uploaded = newImageUploads.find(
              (upload) => upload.displayOrder === img.displayOrder
            );
            return uploaded
              ? {
                  tmpKey: uploaded.tmpKey,
                  displayOrder: uploaded.displayOrder,
                }
              : null;
          }
        }).filter((img): img is { id: number; displayOrder: number } | { tmpKey: string; displayOrder: number } => img !== null);

        // API 요청 데이터 구성
        const requestData: PatchReviewData = {
          content: content.trim() === "" ? "" : content.trim() || null,
          tags: tags.length === 0 ? [] : tags,
          images: finalImages.length === 0 ? [] : finalImages,
        };

        await patchEventReviewDetail(reviewData.id, requestData);
        openAlert("리뷰 수정이 완료되었어요.");
      } else {
        // 신규 등록
        const newImageUploads = await uploadNewImages(images);
        
        await api.post(`/api/events/${eventId}/reviews`, {
          content,
          tags,
          images: newImageUploads.map((img) => ({
            tmpKey: img.tmpKey,
            displayOrder: img.displayOrder,
          })),
        });
        openAlert("리뷰 등록이 완료되었어요.");
      }

      onClose?.();
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
      const errorMessage = axiosError?.response?.data?.message || axiosError?.response?.data?.detail || "비밀번호 변경에 실패했습니다. 다시 시도해주세요.";
      openAlert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-[24px] pt-[24px] pb-[80px] flex flex-col justify-center">
      <WriteTitle id={1} question={"내용 작성"} />
      <div className="w-full border border-divider-1 rounded-[4px] p-[12px] mb-[32px]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰 내용을 입력해주세요."
          maxLength={300}
          className="w-full h-[230px] resize-none focus:outline-none text-[14px] text-text-5 bg-transparent"
        />
        <div className="flex justify-end text-[12px] text-text-3">
          {content.length}/300
        </div>
      </div>

      <WriteTitle
        id={2}
        question={"태그 추가"}
        answer={"태그는 최대 4개까지 등록할 수 있어요."}
      />
      <div className="flex flex-col gap-2 mb-[12px]">
        <Input
          _value={newTag}
          _state="textbox-basic"
          _onChange={(value) => setNewTag(value)}
          _inputProps={{
            placeholder: "태그 입력 (최대 4개)",
            className: "placeholder:text-text-3",
          }}
          _wrapperProps={{ className: "w-full" }}
        />
        <div className="flex flex-col gap-[8px] ">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-white w-full h-[44px] text-text-5 text-[14px] font-[400] rounded-[4px] border-[1px] border-divider-1 flex justify-between p-[10px]"
            >
              {tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <TagCancel />
              </button>
            </div>
          ))}
        </div>
        <Button
          _state="main"
          _node="+ 추가하기"
          _onClick={handleAddTag}
          _buttonProps={{
            className: "bg-red-300 text-white mb-[16px] w-full mt-[12px]",
          }}
        />
      </div>

      <WriteTitle
        id={3}
        question={"이미지 추가"}
        answer={"태그는 최대 2개까지 등록할 수 있어요."}
      />
      <div className="flex gap-[8px]">
        {/* 선택된 이미지 2칸 슬롯 */}
        {Array.from({ length: 2 }).map((_, idx) => {
          const image = images[idx];
          return (
            <div
              key={idx}
              className="relative w-[60px] h-[60px] rounded-[4px] border border-divider-1 flex justify-center items-center overflow-hidden bg-[#F9F9F9]"
            >
              {image?.preview ? (
                <>
                  <Image
                    width={60}
                    height={60}
                    src={image.preview}
                    alt={`uploaded-${idx}`}
                    className="object-cover"
                  />
                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
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

      {/* 이미지 미리보기 */}
      <div className="flex gap-[8px] min-w-max items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
        <Button
          _state="main"
          _node="+ 추가하기"
          _onClick={() => {
            if (images.length >= 2)
              return openAlert("최대 2개의 이미지만 등록할 수 있어요.");
            fileInputRef.current?.click();
          }}
          _buttonProps={{
            className: "bg-red-300 text-white mt-[16px] w-full",
          }}
        />
      </div>

      <Bottombar
        _bottomNode={
          <Button
            _state="main"
            _node={
              isSubmitting ? <Spinner /> : isEdit ? "리뷰 수정하기" : "리뷰 등록하기"
            }
            _onClick={handleSubmit}
            _buttonProps={{
              disabled: isSubmitting,
            }}
          />
        }
      />
    </div>
  );
}
