"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Forward from "@/svgs/Forward.svg";
import { getMyRegisterArtist } from "@/apis/api";
import useModalStore from "@/app/stores/useModalStore";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import { useRouter } from "next/navigation";

interface ArtistItem {
  id: number;
  nameKr: string;
  imageUrl: string;
  birthDate: string;
  type: string;
  createdAt: string;
}

export default function MyRegisterArtistPage() {
  const router = useRouter();
  const handleBackRouter = () => router.back();
  const [data, setData] = useState<ArtistItem[]>([]);
  const { openAlert } = useModalStore();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMyRegisterArtist();

      if (!res || res.totalElements === 0) {
        openAlert("등록한 아티스트가 없습니다.");
        return;
      }

      setData(res.content);
    };

    fetchData();
  }, [openAlert]);

  return (
    <>
      <Topbar
        _leftImage={<Backward onClick={handleBackRouter} />}
        _topNode="내가 등록한 아티스트"
      />
      <div className="flex flex-col w-full justify-center pt-[16px] px-[24px]">
        <div className="flex justify-between items-center mb-[16px]">
          <div className="flex items-center gap-[6px]">
            <h1 className="typo-label2 text-text-5">등록한 아티스트</h1>
            <span className="text-text-3 typo-label2">{data.length}</span>
          </div>
        </div>
      </div>

      {/* 왼쪽 텍스트 + 이미지 */}
      {data.length > 0 && (
        <div className="flex flex-col gap-[2px] px-[24px]">
          {data.map((artist) => (
            <ArtistCard key={artist.id} {...artist} />
          ))}
        </div>
      )}
    </>
  );
}

function ArtistCard({ id, nameKr, imageUrl, createdAt }: ArtistItem) {
  return (
    <div
      className="flex justify-between items-center py-[12px] border-b border-divider-1 cursor-pointer"
      key={id}
    >
      <div className="flex items-center gap-4">
        <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-200">
          {imageUrl && (
            <Image
              src={imageUrl}
              width={40}
              height={40}
              alt={nameKr}
              className="w-full h-full object-cover"
              unoptimized
            />
          )}
        </div>

        <div className="flex flex-col">
          <p className="typo-label2 text-text-5">{nameKr}</p>
          <p className="typo-caption3 text-text-2">
            {(() => {
              const date = new Date(createdAt);
              return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
            })()}
          </p>
        </div>
      </div>

      <Forward />
    </div>
  );
}
