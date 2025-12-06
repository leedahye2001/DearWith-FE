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

      {/* 왼쪽 텍스트 + 이미지 */}
      {data.length > 0 && (
        <div className="flex flex-col gap-[2px]">
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
      className="flex justify-between items-center py-[16px] border-b border-divider-1 cursor-pointer"
      key={id}
    >
      <div className="flex items-center gap-4">
        <div className="w-[52px] h-[52px] rounded-full overflow-hidden bg-gray-200">
          {imageUrl && (
            <Image
              src={imageUrl}
              width={52}
              height={52}
              alt={nameKr}
              className="w-full h-full object-cover"
              unoptimized
            />
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-[14px] font-[700] text-text-5">{nameKr}</p>
          <p className="text-[12px] font-[500] text-text-4">{createdAt}</p>
        </div>
      </div>

      <Forward />
    </div>
  );
}
