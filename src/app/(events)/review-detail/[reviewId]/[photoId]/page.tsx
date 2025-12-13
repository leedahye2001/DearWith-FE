"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";
import Etc from "@/svgs/Etc.svg";
import { postReviewLike, deleteReviewLike, getReviewDetail } from "@/apis/api";
import Image from "next/image";
import Spinner from "@/components/Spinner/Spinner";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";

/* ===================== types ===================== */

interface ReviewDetail {
  id: string;
  nickname: string;
  profileImageUrl?: string;
  content: string;
  createdAt: string;
  images?: {
    variants?: { name: string; url: string; id?: number }[];
  }[];
  tags?: string[];
  likeCount: number;
  liked: boolean;
  editable: boolean;
}

/* ===================== utils ===================== */

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const getImageUrl = (variants?: { name: string; url: string }[]) =>
  variants?.[2]?.url || variants?.[1]?.url || variants?.[0]?.url || null;

/* ===================== component ===================== */

const ReviewDetail = () => {
  // ✅ 모든 Hook을 최상위에서 호출
  const params = useParams<{
    reviewId: string;
    photoId: string;
  }>();
  const router = useRouter();
  const [post, setPost] = useState<ReviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // params에서 값 추출 (params가 null일 수 있음)
  const reviewId = params?.reviewId;
  const photoId = params?.photoId;

  useEffect(() => {
    if (!reviewId || !photoId) return;

    const fetchReview = async () => {
      try {
        const data = await getReviewDetail(reviewId, photoId);
        console.log("API Response:", data);

        // API가 단일 객체를 반환
        setPost(data);
      } catch (err) {
        console.error(err);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReview();
  }, [reviewId, photoId]);

  const handleLikeToggle = async () => {
    if (!post) return;

    const prev = post;

    const next = {
      ...post,
      liked: !post.liked,
      likeCount: post.likeCount + (post.liked ? -1 : 1),
    };

    setPost(next);

    try {
      if (post.liked) {
        await deleteReviewLike(post.id);
      } else {
        await postReviewLike(post.id);
      }
    } catch (err) {
      console.error(err);
      setPost(prev);
    }
  };

  // ✅ 조건부 렌더링은 Hook 호출 이후에
  if (!params) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Spinner />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        리뷰가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-bg-1">
      <Topbar
        _leftImage={
          <button onClick={() => router.back()}>
            <Backward />
          </button>
        }
        _topNode="포토리뷰"
      />

      {/* header */}
      <div className="flex justify-between items-center my-[20px] px-[24px]">
        <div className="flex">
          <div className="w-[36px] h-[36px] rounded-full overflow-hidden bg-divider-1">
            {post.profileImageUrl && (
              <Image
                src={post.profileImageUrl}
                alt={post.nickname}
                width={36}
                height={36}
                className="object-cover"
              />
            )}
          </div>

          <div className="pl-[12px]">
            <p className="font-[600]">{post.nickname || "익명"}</p>
            <p className="text-[12px] text-text-2">
              {formatDateTime(post.createdAt)}
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
        >
          <Etc />
        </button>
      </div>

      {/* images */}
      {Array.isArray(post.images) && post.images.length > 0 && (
        <div className="flex gap-[6px] my-[12px] overflow-x-auto px-[24px]">
          {post.images.map((img, idx) => {
            if (!img || !img.variants) return null;

            const url = getImageUrl(img.variants);
            if (!url) return null;

            return (
              <div
                key={`image-${post.id}-${idx}`}
                className="flex-1 min-w-[160px] aspect-square overflow-hidden relative rounded-[4px]"
              >
                <Image
                  src={url}
                  alt={`review-${idx}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
            );
          })}
        </div>
      )}

      <div className="px-[24px]">
        {/* content */}
        <p className="text-[14px] my-[12px]">{post.content || ""}</p>

        {/* tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex gap-[4px] flex-wrap">
            {post.tags.map((tag, idx) => (
              <span
                key={`tag-${post.id}-${idx}`}
                className="px-[6px] py-[2px] bg-[#FFE5AF] text-[#FD725C] text-[12px] rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* like */}
        <button
          onClick={handleLikeToggle}
          className="flex items-center gap-[4px] my-[16px]"
        >
          {post.liked ? <HeartFill /> : <HeartDefault />}
          {post.likeCount || 0}
        </button>
      </div>
    </div>
  );
};

export default ReviewDetail;
