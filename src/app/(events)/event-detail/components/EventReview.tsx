"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeartDefault from "@/svgs/HeartDefault.svg";
import HeartFill from "@/svgs/HeartFill.svg";
import Etc from "@/svgs/Etc.svg";
import { FAB } from "@/components/FAB/FAB";
import Write from "@/svgs/Write.svg";
import EventReviewWrite, { ReviewDetail } from "./EventReviewWrite";
import {
  getEventReviewDetail,
  getEventPhotoReviews,
  postReviewLike,
  deleteReviewLike,
} from "@/apis/api";
import Image from "next/image";
import Spinner from "@/components/Spinner/Spinner";

interface PostImage {
  reviewId: string;
  image: {
    id: string;
    variants: { name: string; url: string }[];
  };
}

interface Post {
  id: string;
  nickname: string;
  profileImageUrl: string;
  content: string;
  createdAt: string;
  images: {
    group: string;
    variants: { name: string; url: string }[];
  }[];
  tags: string[];
  likeCount: string;
  liked: boolean;
  editable: boolean;
}

interface PostResponse {
  content: Post[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface EventReviewProps {
  eventId: string;
}

const EventReview = ({ eventId }: EventReviewProps) => {
  const router = useRouter();

  const [posts, setPosts] = useState<PostResponse | null>(null);
  const [photoReviews, setPhotoReviews] = useState<PostImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isWriting, setIsWriting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const reviewData = await getEventReviewDetail(eventId);
        setPosts(reviewData);

        const photoData = await getEventPhotoReviews(eventId);
        setPhotoReviews(photoData.images || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleLikeToggle = async (reviewId: string) => {
    if (!posts) return;
    const updatedPosts = { ...posts };
    const postIndex = updatedPosts.content.findIndex((p) => p.id === reviewId);
    if (postIndex === -1) return;

    const target = updatedPosts.content[postIndex];
    const wasLiked = target.liked;

    try {
      target.liked = !wasLiked;
      target.likeCount += wasLiked ? -1 : 1;
      setPosts({ ...updatedPosts });

      if (wasLiked) await deleteReviewLike(reviewId);
      else await postReviewLike(reviewId);
    } catch (err) {
      console.error(err);
      target.liked = wasLiked;
      target.likeCount += wasLiked ? 1 : -1;
      setPosts({ ...updatedPosts });
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[400px] text-text-5">
        <Spinner />
      </div>
    );

  const editingReview = editingReviewId
    ? (() => {
        const post = posts?.content.find((p) => p.id === editingReviewId);
        if (!post) return undefined;
        return {
          id: post.id,
          content: post.content,
          tags: post.tags,
          images: post.images.map((img, idx) => ({
            url: img.variants[2]?.url,
            displayOrder: idx,
          })),
        } as ReviewDetail;
      })()
    : undefined;

  if (isWriting) {
    return (
      <EventReviewWrite
        eventId={eventId}
        reviewData={editingReview}
        onClose={() => {
          setIsWriting(false);
          setEditingReviewId(null);
          getEventReviewDetail(eventId).then((data) => setPosts(data));
        }}
      />
    );
  }

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center">
      {/* 상단: 사진 리뷰 */}
      <div className="px-[24px] mt-[16px]">
        <h3 className="font-[600] text-[14px] text-text-5 mb-[8px]">
          등록된 리뷰 {photoReviews.length}개
        </h3>

        <div className="flex gap-[8px]">
          {photoReviews
            .slice()
            .slice(0, 4)
            .map((img, idx, arr) => {
              const url =
                Array.isArray(img?.image?.variants) &&
                img.image.variants.length > 0
                  ? img.image.variants[2].url
                  : null;

              const isLast = idx === arr.length - 1 && photoReviews.length > 4;

              return (
                <div
                  key={idx}
                  className="relative w-[78px] h-[78px] rounded-[4px] overflow-hidden flex-shrink-0"
                >
                  <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: `url(${url})` }}
                  />

                  {isLast && (
                    <div
                      onClick={() =>
                        router.push(`/event-photo-review/${eventId}`)
                      }
                      className="
                  absolute inset-0 
                  bg-black/40
                  z-20 flex items-center justify-center
                  cursor-pointer
                "
                    >
                      <span className="text-white font-[600] text-[14px]">
                        + 더 보기
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* 리뷰 게시글 */}
      {posts?.content?.length ? (
        posts.content.map((post) => (
          <div
            key={post.id}
            className="mx-[24px] border-b-[0.8px] border-divider-1"
          >
            <div className="flex justify-between w-full items-center my-[20px]">
              {/* 프로필 */}
              <div className="flex w-full">
                <div className="w-[36px] h-[36px] rounded-[50px] bg-divider-1 overflow-hidden">
                  {post.profileImageUrl ? (
                    <Image
                      src={post.profileImageUrl}
                      alt={post.nickname}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-[36px] h-[36px] flex items-center justify-center bg-gray-200 rounded-full text-[10px] text-text-3">
                      No Img
                    </div>
                  )}
                </div>
                <div className="flex flex-col pl-[12px]">
                  <p className="text-text-5 font-[600] text-[14px]">
                    {post.nickname}
                  </p>
                  <p className="text-text-2 font-[600] text-[12px]">
                    {new Date(post.createdAt).toLocaleString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* 메뉴 */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === post.id ? null : post.id);
                }}
                className="relative"
              >
                <Etc />
                {openMenuId === post.id && (
                  <div
                    className="absolute right-0 mt-[8px] bg-white shadow-md rounded-[8px] py-[8px] z-50 w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {post.editable ? (
                      <>
                        <button
                          className="w-full text-left px-[12px] py-[8px] hover:bg-gray-100"
                          onClick={() => {
                            setEditingReviewId(post.id);
                            setIsWriting(true);
                            setOpenMenuId(null);
                          }}
                        >
                          수정하기
                        </button>
                        <button className="w-full text-left px-[12px] py-[8px] text-red-500 hover:bg-gray-100">
                          삭제하기
                        </button>
                      </>
                    ) : (
                      <button className="w-full text-left px-[12px] py-[8px] hover:bg-gray-100">
                        신고하기
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 이미지 영역 */}
            {post.images.length > 0 && (
              <div className="flex justify-between my-[12px] ">
                {post.images.map((img, idx) => {
                  const url = img.variants[2]?.url;
                  return (
                    <div
                      key={idx}
                      className="w-[160.5px] h-[160.5px] rounded-[4px] flex-shrink-0 overflow-hidden"
                    >
                      {url ? (
                        <Image
                          width={160.5}
                          height={160.5}
                          src={url}
                          alt={url}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <p className="text-text-3 text-[12px]">이미지 없음</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 본문 */}
            <p className="w-[327px] font-[400] text-[14px] text-text-5 leading-[165%] my-[12px]">
              {post.content}
            </p>

            {/* 태그 */}
            <div className="flex flex-wrap gap-[4px]">
              {post.tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="px-[6px] py-[2px] bg-[#FFE5AF] text-[#FD725C] text-[12px] font-[600] rounded-[4px] flex justify-center items-center"
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* 좋아요 */}
            <div className="flex my-[20px] gap-[16px] text-text-3 font-[600] text-[12px] justify-start">
              <button
                className="flex gap-[2px] items-center"
                onClick={() => handleLikeToggle(post.id)}
              >
                {post.liked ? <HeartFill /> : <HeartDefault />}
                <p>{post.likeCount}</p>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col justify-center items-center p-[24px] gap-[16px] h-[500px]">
          <h3 className="text-[18px] font-[700] text-text-5">
            아직 리뷰가 없어요
          </h3>
          <p className="text-text-4 text-[14px]">
            첫 번째 리뷰를 작성해보세요!
          </p>
        </div>
      )}

      {/* 글쓰기 FAB */}
      <FAB _icon={<Write />} _onClick={() => setIsWriting(true)} />
    </div>
  );
};

export default EventReview;
