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

interface PhotoImage {
  id: number;
  variants: PhotoVariant[];
}

interface PhotoReview {
  reviewId: number;
  image: PhotoImage;
}

export default function EventPhotoReviewsClient({ id }: { id: string }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await getEventPhotoReviews(id);

        const list = res?.images ?? [];

        const formatted: PhotoReview[] = list.map((item: any) => {
          const large = item.image?.variants?.[2];

          return {
            reviewId: Number(item.reviewId),
            image: {
              id: item.image.id,
              variants: large ? [large] : [],
            },
          };
        });

        setPhotos(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [id]);

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

      <div className="grid grid-cols-3 gap-[8px]">
        {photos.map((photo) => {
          const variant = photo.image.variants[0];
          if (!variant) return null;

          return (
            <div
              key={photo.image.id}
              className="relative w-full aspect-square cursor-pointer"
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
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
