"use client";

import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleKakaoLogin = () => {
    router.push(
      "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a1c8f8ab77b2ad88da439427df5c5226&redirect_uri=http://localhost:3000/oauth/kakao"
    );
  };

  return (
    <>
      <button onClick={handleKakaoLogin}>카카오 로그인</button>
    </>
  );
};

export default Page;
