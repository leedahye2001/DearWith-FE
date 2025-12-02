"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Forward from "@/svgs/Forward.svg";
import Settings from "@/svgs/Settings.svg";
import ProfileBasic from "@/svgs/ProfileBasic.svg"; 
import {
  getMyPage,
  updateEventNotifications,
  updateServiceNotifications,
} from "@/apis/api";
import ToggleItem from "../components/ToggleItem";
import useModalStore from "@/app/stores/useModalStore";
import Spinner from "@/components/Spinner/Spinner";
import { useRouter } from "next/navigation";

export interface MenuItemProps {
  text: string;
  path?: string;
  hasData?: boolean;
}

export interface MyPageResponse {
  profile: {
    nickname: string;
    profileImageUrl: string;
  };
  stats: {
    eventBookmarkCount: number;
    artistBookmarkCount: number;
    reviewCount: number;
  };
  notifications: {
    eventNotificationEnabled: boolean;
    serviceNotificationEnabled: boolean;
  };
}

const Page = () => {
  const [data, setData] = useState<MyPageResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMyPage();
      setData(res);
    };

    fetchData();
  }, []);

  if (!data) return <Spinner />;

  const { profile, stats, notifications } = data;

  return (
    <div className="px-[24px] mt-[54px] pb-10">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-[12px]">
          <div className="w-[48px] h-[48px] rounded-full overflow-hidden">
            {profile?.profileImageUrl ? (
              <Image
                src={profile.profileImageUrl}
                width={52}
                height={52}
                alt="profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <ProfileBasic className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-[16px] font-[700] text-text-5">
              {profile?.nickname} 님
            </p>
            <p className="text-[12px] text-text-2">@{profile?.nickname}</p>
          </div>
        </div>

        <Settings />
      </div>

      <div className="flex gap-5 mt-5">
        <Stat label="찜한 이벤트" value={stats.eventBookmarkCount} />
        <Stat label="찜한 아티스트" value={stats.artistBookmarkCount} />
        <Stat label="작성한 리뷰" value={stats.reviewCount} />
      </div>

      <Divider />

      <Section title="나의 활동">
        <MenuItem
          text="내가 등록한 이벤트"
          path="/my-register-event"
          hasData={stats.eventBookmarkCount > 0}
        />
        <MenuItem
          text="내가 등록한 아티스트"
          path="/my-register-artist"
          hasData={stats.artistBookmarkCount > 0}
        />
      </Section>

      <Divider />

      <Section title="알림">
        <ToggleItem
          label="이벤트 알림 설정"
          defaultState={notifications.eventNotificationEnabled}
          onChange={(value: boolean) => updateEventNotifications(value)}
        />

        <ToggleItem
          label="광고성 서비스 알림 설정"
          defaultState={notifications.serviceNotificationEnabled}
          onChange={(value: boolean) => updateServiceNotifications(value)}
        />
      </Section>
      <Divider />

      <Section title="고객지원">
        <MenuItem text="공지사항" />
        <MenuItem text="1:1 문의하기" />
        <MenuItem text="비밀번호 변경" />
        <MenuItem text="앱 버전 v0.10" />
      </Section>

      <Divider />
      <MenuItem text="개인정보처리방침" />
      <Divider />
      <button className="mt-6 text-left text-[14px] font-[400] text-text-5">
        로그아웃
      </button>
    </div>
  );
};
export default Page;

function Stat({ value, label }: { value: number; label: string }) {
  const valueClass = value === 0 ? "text-text-3" : "text-text-5";

  return (
    <div className="text-center">
      <p className={`text-[16px] font-[500] ${valueClass}`}>{value}</p>
      <p className="text-[12px] font-[500] text-text-2">{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="border-[0.8px] border-b border-divider-1 my-[20px]" />;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <p className="text-[14px] font-[600] mb-[10px]">{title}</p>
      <div className="rounded-[10px] overflow-hidden">{children}</div>
    </div>
  );
}

function MenuItem({ text, path, hasData }: MenuItemProps) {
  const { openModal } = useModalStore();
  const router = useRouter();

  const handleClick = () => {
    if (hasData === false) {
      if (text.includes("이벤트")) openModal("등록한 이벤트가 없습니다.");
      else if (text.includes("아티스트"))
        openModal("등록한 아티스트가 없습니다.");
      return;
    }

    if (path) router.push(path);
  };

  return (
    <div
      className="flex justify-between items-center py-[16px] cursor-pointer"
      onClick={handleClick}
    >
      <p className="text-[14px] font-[400]">{text}</p>
      <Forward />
    </div>
  );
}
