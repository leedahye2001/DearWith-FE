"use client";

import { patchEventReviewDetail } from "@/apis/api";
import api from "@/apis/instance";
import useModalStore from "@/app/stores/useModalStore";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Spinner from "@/components/Spinner/Spinner";
import Image from "next/image";
import { useRef, useState } from "react";
import WriteTitle from "./WriteTitle";
import TagCancel from "@/svgs/TagCancel.svg";
import Close from "@/svgs/Close.svg";
import Checker from "@/svgs/Checker.svg";

interface UploadedImage {
  tmpKey: string;
  url: string;
  displayOrder: number;
}

interface ReviewImage {
  id?: number;
  tmpKey?: string;
  url?: string;
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    reviewData?.images.map((img) => img.url || "") || []
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const totalCount = imageFiles.length + selected.length;
    if (totalCount > 2)
      return openAlert("최대 2개의 이미지만 등록할 수 있어요.");
    const newPreviews = selected.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...selected]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
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

  const uploadImages = async (images: File[]): Promise<UploadedImage[]> => {
    if (!images.length) return [];
    const uploaded: UploadedImage[] = [];
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const presignRes = await api.post("/api/uploads/presign", {
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        domain: "event",
      });
      const { url, key } = presignRes.data as { url: string; key: string };
      await putToS3(url, file, file.type || "application/octet-stream");
      uploaded.push({ tmpKey: key, url, displayOrder: i });
    }
    return uploaded;
  };

  // 수정/등록 처리
  const handleSubmit = async () => {
    if (!content.trim()) return openAlert("리뷰를 작성해주세요.");
    try {
      setIsSubmitting(true);
      const uploadedImages = await uploadImages(imageFiles);

      if (isEdit && reviewData) {
        await patchEventReviewDetail(reviewData.id, {
          content,
          tags,
          images: uploadedImages.map((img) => ({
            tmpKey: img.tmpKey,
            displayOrder: img.displayOrder,
          })),
        });
        openAlert("리뷰 수정이 완료되었어요.");
      } else {
        await api.post(`/api/events/${eventId}/reviews`, {
          content,
          tags,
          images: uploadedImages.map((img) => ({
            tmpKey: img.tmpKey,
            displayOrder: img.displayOrder,
          })),
        });
        openAlert("리뷰 등록이 완료되었어요.");
      }

      onClose?.();
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-[20px] py-[24px] flex flex-col justify-center">
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
          const image = imagePreviews[idx];
          return (
            <div
              key={idx}
              className="relative w-[60px] h-[60px] rounded-[4px] border border-divider-1 flex justify-center items-center overflow-hidden bg-[#F9F9F9]"
            >
              {image ? (
                <>
                  <Image
                    width={60}
                    height={60}
                    src={image}
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
            if (imagePreviews.length >= 2)
              return openAlert("최대 2개의 이미지만 등록할 수 있어요.");
            fileInputRef.current?.click();
          }}
          _buttonProps={{
            className: "bg-red-300 text-white mt-[16px] w-full",
          }}
        />
      </div>

      <Button
        _state="main"
        _node={
          isSubmitting ? <Spinner /> : isEdit ? "수정하기" : "리뷰 등록하기"
        }
        _onClick={handleSubmit}
        _buttonProps={{
          className: "w-full my-[60px]",
          disabled: isSubmitting,
        }}
      />
    </div>
  );
}
