"use client";

import { useEffect, useState } from "react";
import { getEventPhotoReviews } from "@/apis/api";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Spinner from "@/components/Spinner/Spinner";

interface PhotoVariant {
  name: string;
  url: string;
}

interface PhotoReviewImage {
  reviewId: string;
  images: PhotoVariant[];
}

export default function EventPhotoReviewsClient({ id }: { id: string }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoReviewImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await getEventPhotoReviews(id);

        const formatted: PhotoReviewImage[] = (res?.images ?? []).map(
          (item: any) => {
            const large = item.image?.variants?.[2];

            return {
              reviewId: String(item.reviewId),
              images: large ? [large] : [], // 배열로 감싸줘야 함
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-text-5">
        <Spinner />
      </div>
    );

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

      <div className="grid grid-cols-3 gap-[8px]">
        {photos.map((photo) =>
          photo.images.map((variant, index) => (
            <div
              key={`${photo.reviewId}-${index}`}
              className="relative w-full aspect-square cursor-pointer"
              onClick={() =>
                router.push(
                  `/event-photo-review/${id}/${photo.reviewId}?img=${index}`
                )
              }
            >
              <Image
                width={122}
                height={122}
                src={variant.url}
                alt={variant.name}
                className="object-cover w-full h-full"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
