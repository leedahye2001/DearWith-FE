import { useCallback, useEffect, useMemo, useState } from "react";
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
    const timer = setInterval(() => {
      if (carouselIndex === imageSrcArray.length - 1) {
        resetIndexAndTransition();
      } else {
        setCarouselIndex((prev) => prev + 1);
        setCarouselTransition("transform 0.5s ease-in-out");
      }
    }, controlTime);

    return () => clearInterval(timer);
  }, [
    carouselIndex,
    controlTime,
    imageSrcArray.length,
    resetIndexAndTransition,
  ]);

  const getCarouselStyles = (): React.CSSProperties => {
    return {
      transform: `translateX(-${carouselIndex * 100}%)`,
      transition: carouselTransition,
    };
  };

  return (
    <div className="relative bg-primary w-full h-[211px] mb-[24px] flex justify-center items-center overflow-hidden">
      <div
        className="w-full h-full flex items-center"
        style={getCarouselStyles()}
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
