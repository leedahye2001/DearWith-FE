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
  id: string; // 리뷰 ID
  variants: PhotoVariant[];
}

export default function EventPhotoReviewsClient({ id }: { id: string }) {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoReviewImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await getEventPhotoReviews(id);
        setPhotos(res.images || []);
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

      <div className="grid grid-cols-3 gap-[8px] p-[16px]">
        {photos.map((photo) =>
          photo.variants.map((variant, index) => (
            <div
              key={`${photo.id}-${index}`}
              className="relative w-full aspect-square cursor-pointer"
              onClick={() =>
                router.push(
                  `/event-photo-review/${id}/${photo.id}?img=${index}`
                )
              }
            >
              <Image
                width={122}
                height={122}
                src={variant.url}
                alt={variant.name}
                className="object-cover rounded-[6px] w-full h-full"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
