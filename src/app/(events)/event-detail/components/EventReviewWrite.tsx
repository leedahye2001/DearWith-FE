"use client";

import { patchEventReviewDetail } from "@/apis/api";
import api from "@/apis/instance";
import useModalStore from "@/app/stores/useModalStore";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Spinner from "@/components/Spinner/Spinner";
import Image from "next/image";
import { useState } from "react";

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
  reviewData?: ReviewDetail; // 목록에서 넘겨주는 리뷰 데이터
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ 태그 추가/삭제
  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (tags.length >= 4)
      return openAlert("태그는 최대 4개까지 추가할 수 있습니다.");
    setTags([...tags, newTag.trim()]);
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // ✅ 이미지 추가/삭제
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

  // ✅ 이미지 업로드 (S3 Presigned URL)
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

  // ✅ 수정/등록 처리
  const handleSubmit = async () => {
    if (!content.trim()) return openAlert("내용을 입력해주세요.");
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
        openAlert("리뷰 등룍이 완료되었어요.");
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
    <div className="px-[20px] py-[24px]">
      <h2 className="text-[18px] font-[700] text-text-5 mb-[16px]">
        {isEdit ? "리뷰 수정하기" : "리뷰 작성하기"}
      </h2>

      {/* 내용 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="리뷰 내용을 입력해주세요"
        className="w-full h-[120px] p-[12px] border border-divider-1 rounded-[8px] text-[14px] text-text-5 focus:outline-none mb-[16px]"
      />

      {/* 태그 입력 */}
      <div className="flex gap-2 mb-[12px]">
        <Input
          _value={newTag}
          _state="textbox-basic"
          _onChange={(value) => setNewTag(value)}
          _inputProps={{
            placeholder: "태그 입력 (최대 4개)",
            className: "placeholder:text-text-3",
          }}
        />
        <Button
          _state="sub"
          _node="추가"
          _onClick={handleAddTag}
          _buttonProps={{ className: "bg-[#E6E6E6] text-black" }}
        />
      </div>

      {/* 태그 리스트 */}
      <div className="flex flex-wrap gap-2 mb-[16px]">
        {tags.map((tag) => (
          <div
            key={tag}
            className="bg-[#F86852] text-white text-[12px] font-[600] px-[8px] py-[4px] rounded-[12px] flex items-center gap-1"
          >
            #{tag}
            <button onClick={() => handleRemoveTag(tag)}>×</button>
          </div>
        ))}
      </div>

      {/* 이미지 업로드 */}
      <div className="mb-[16px]">
        <label className="text-[14px] font-[600] text-text-5 mb-[8px] block">
          이미지 추가 (최대 2장)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mb-[8px]"
        />
        <div className="flex gap-2">
          {imagePreviews.map((url, idx) => (
            <div key={idx} className="relative">
              <Image
                width={100}
                height={100}
                src={url}
                alt={`preview-${idx}`}
                className="w-full h-full object-cover rounded-[8px]"
              />
              <button
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-black/60 text-white text-[12px] rounded-full w-[20px] h-[20px]"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button
        _state="main"
        _node={
          isSubmitting ? <Spinner /> : isEdit ? "수정하기" : "리뷰 등록하기"
        }
        _onClick={handleSubmit}
        _buttonProps={{
          className: "mt-6 bg-[#FD725C] hover:cursor-pointer w-full",
          disabled: isSubmitting,
        }}
      />
    </div>
  );
}
