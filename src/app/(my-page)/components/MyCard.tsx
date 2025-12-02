import Image from "next/image";
import Forward from "@/svgs/Forward.svg";

export interface RegisterArtistItem {
  id: number;
  nameKr: string;
  nameEn: string;
  imageUrl: string;
  type: string;
  createdAt: string;
  birthDate: string;
  debutDate: string;
}

export function MyCard({ item }: { item: RegisterArtistItem }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-[10px] border-divider-1 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-gray-200">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.nameKr}
              width={50}
              height={50}
              className="object-cover w-full h-full"
            />
          )}
        </div>

        <div>
          <p className="text-[14px] font-[500] text-text-5">{item.nameKr}</p>
          <p className="text-[12px] text-text-3">{item.type}</p>
        </div>
      </div>

      <Forward />
    </div>
  );
}
