"use client";

import { useEffect, useState, useRef } from "react";
import { getEventPhotoReviews } from "@/apis/api";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Spinner from "@/components/Spinner/Spinner";

interface PhotoVariant {
  name: string;
  url: string;
}

interface PhotoImage {
  id: number;
  variants: PhotoVariant[];
}

interface PhotoReview {
  reviewId: number;
  image: PhotoImage;
}

// API 응답 타입 정의
interface ApiPhotoReviewItem {
  reviewId: string | number;
  image: {
    id: number;
    variants?: PhotoVariant[];
  };
}

interface ApiResponse {
  images?: ApiPhotoReviewItem[];
}

export default function EventPhotoReviewsClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightImageId = searchParams?.get("highlight");
  const [photos, setPhotos] = useState<PhotoReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const photoRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res: ApiResponse = await getEventPhotoReviews(id);

        const list = res?.images ?? [];

        const formatted: PhotoReview[] = list.map(
          (item: ApiPhotoReviewItem) => {
            const photo1x = item.image?.variants?.[0];
            const photo2x = item.image?.variants?.[1];
            const selectedVariant = photo1x || photo2x;

            return {
              reviewId: Number(item.reviewId),
              image: {
                id: item.image.id,
                variants: selectedVariant ? [selectedVariant] : [],
              },
            };
          }
        );

        setPhotos(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [id]);

  // 하이라이트 및 스크롤 처리
  useEffect(() => {
    if (!highlightImageId || photos.length === 0 || isLoading) return;

    const imageId = Number(highlightImageId);
    const targetElement = photoRefs.current[imageId];

    if (targetElement) {
      // 약간의 딜레이 후 스크롤 (렌더링 완료 대기)
      setTimeout(() => {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // 하이라이트 애니메이션 시작
        setHighlightedId(imageId);

        // 2초 후 하이라이트 제거
        setTimeout(() => {
          setHighlightedId(null);
          // URL에서 highlight 파라미터 제거
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("highlight");
          window.history.replaceState({}, "", newUrl.toString());
        }, 2000);
      }, 100);
    }
  }, [highlightImageId, photos, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-bg-1 min-h-screen">
      <Topbar
        _leftImage={
          <button onClick={() => router.back()}>
            <Backward />
          </button>
        }
        _topNode="포토리뷰 전체보기"
      />

      <div className="grid grid-cols-3 gap-[8px] p-[8px]">
        {photos.length === 0 ? (
          <div className="col-span-3 flex justify-center items-center h-[300px]">
            <p className="text-text-3">포토리뷰가 없습니다.</p>
          </div>
        ) : (
          photos.map((photo) => {
            const variant = photo.image.variants[0];
            if (!variant) return null;

              const isHighlighted = highlightedId === photo.image.id;

            return (
              <div
                key={photo.image.id}
                  ref={(el) => {
                    photoRefs.current[photo.image.id] = el;
                  }}
                  className={`relative w-full aspect-square cursor-pointer transition-all duration-700 ease-out ${
                    isHighlighted
                      ? "scale-110 z-10 shadow-2xl ring-4 ring-primary"
                      : "scale-100"
                  }`}
                  style={{
                    animation: isHighlighted ? "dropHighlightScale 0.6s ease-out" : "none",
                  }}
                onClick={() =>
                  router.push(
                    `/review-detail/${photo.reviewId}/${photo.image.id}`
                  )
                }
              >
                <Image
                  src={variant.url}
                  alt={variant.name}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                    className="object-cover rounded-[4px]"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
