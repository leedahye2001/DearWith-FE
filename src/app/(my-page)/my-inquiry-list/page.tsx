"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/template/Topbar";
import Backward from "@/svgs/Backward.svg";
import Forward from "@/svgs/Forward.svg";
import Spinner from "@/components/Spinner/Spinner";
import { getMyInquiryList } from "@/apis/api";
import Write from "@/svgs/Write.svg";
import { FAB } from "@/components/FAB/FAB";

interface InquiriesItem {
  id: number;
  title: string;
  createdAt: string;
  answered: boolean;
}

const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
};

export default function NoticeListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [inquiries, setInquiries] = useState<InquiriesItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await getMyInquiryList();

        setInquiries(res.content ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [id]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="relative bg-bg-1 h-[100%] flex flex-col">
      <Topbar
        _leftImage={
          <button onClick={() => router.back()}>
            <Backward />
          </button>
        }
        _topNode="1:1 문의하기"
      />

      <div className="flex-1 px-[24px] flex flex-col">
        {inquiries.length > 0 ? (
          <div className="flex flex-col gap-[12px] overflow-auto">
            {inquiries.map((content) => (
              <div
                key={content.id}
                className="flex justify-between items-center border-b py-[12px] border-divider-1 cursor-pointer"
                onClick={() => router.push(`/my-inquiry-detail/${content.id}`)}
              >
                <div>
                  <h1 className="text-[14px] font-[600] text-text-5">
                    {content.title}
                  </h1>
                  <div className="flex items-center gap-[4px] mt-[4px] text-[12px] text-text-4">
                    <span>{formatDate(content.createdAt)}</span>
                  </div>
                </div>

                <Forward />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[14px] text-text-4">문의 내역이 없습니다.</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="absolute bottom-[24px] right-[24px]">
        <FAB
          _icon={<Write />}
          _onClick={() => router.push(`/inquiry-register`)}
        />
      </div>
    </div>
  );
}
