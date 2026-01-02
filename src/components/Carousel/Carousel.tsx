import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";

interface ModalCarouselImageJson {
  images: string[];
}

interface CarouselProps {
  modalCarouselImageJson: ModalCarouselImageJson;
}

export const Carousel: React.FC<CarouselProps> = ({
  modalCarouselImageJson,
}) => {
  const imageJsonArray = modalCarouselImageJson.images;

  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [carouselTransition, setCarouselTransition] = useState<string>("");
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 마지막 이미지 다음에 첫 번째 이미지를 붙여서 무한 루프처럼 보이게
  const imageSrcArray = useMemo<string[]>(() => {
    return [...imageJsonArray, imageJsonArray[0]];
  }, [imageJsonArray]);

  const resetIndexAndTransition = useCallback(() => {
    setCarouselTransition("none");
    setCarouselIndex(0);
  }, []);

  const controlTime = useMemo<number>(() => {
    return carouselTransition === "none" ? 10 : 4000;
  }, [carouselTransition]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    timerRef.current = setInterval(() => {
      if (carouselIndex === imageSrcArray.length - 1) {
        resetIndexAndTransition();
      } else {
        setCarouselIndex((prev) => prev + 1);
        setCarouselTransition("transform 0.5s ease-in-out");
      }
    }, controlTime);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [
    carouselIndex,
    controlTime,
    imageSrcArray.length,
    resetIndexAndTransition,
    isAutoPlaying,
  ]);

  const getCarouselStyles = (): React.CSSProperties => {
    return {
      transform: `translateX(-${carouselIndex * 100}%)`,
      transition: carouselTransition,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // 최소 스와이프 거리

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // 왼쪽으로 스와이프 (다음 이미지)
        if (carouselIndex === imageSrcArray.length - 1) {
          resetIndexAndTransition();
        } else {
          setCarouselIndex((prev) => prev + 1);
          setCarouselTransition("transform 0.5s ease-in-out");
        }
      } else {
        // 오른쪽으로 스와이프 (이전 이미지)
        if (carouselIndex === 0) {
          setCarouselIndex(imageSrcArray.length - 1);
          setCarouselTransition("transform 0.5s ease-in-out");
          setTimeout(() => {
            resetIndexAndTransition();
          }, 500);
        } else {
          setCarouselIndex((prev) => prev - 1);
          setCarouselTransition("transform 0.5s ease-in-out");
        }
      }
    }

    // 자동 재생 재개
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 1000);
  };

  return (
    <div className="relative bg-grey-light w-full h-[211px] mb-[24px] flex justify-center items-center overflow-hidden">
      <div
        className="w-full h-full flex items-center"
        style={{ ...getCarouselStyles(), touchAction: 'pan-x pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {imageSrcArray.map((image, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <Image
              src={image}
              alt={`carousel-${index}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-[12px] right-[12px] flex justify-center items-center px-[15px] py-[4px] rounded-[20px] bg-bg-1/80 text-text-5 text-[12px] font-[600]">
        {(carouselIndex % imageJsonArray.length) + 1}
        <p className="text-text-3 font-[400]">
          &nbsp;|&nbsp;{imageJsonArray.length}
        </p>
      </div>
    </div>
  );
};
