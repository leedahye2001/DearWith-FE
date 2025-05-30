"use client";

import { getMailSend } from "@/apis/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");

  const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const fetchMailData = async () => {
    try {
      await getMailSend(email);
      alert(
        "이메일로 코드가 전송되었습니다. 전송된 인증 코드를 아래에 입력해주세요."
      );
      router.push("/mail-verify");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <h1>디어위드에서 사용할 이메일을 입력해 주세요</h1>
      <p>이메일</p>
      <input
        className="w-full border border-2"
        type="text"
        value={email}
        onChange={handleMailChange}
      />
      <button className="hover:cursor-pointer" onClick={fetchMailData}>
        이메일 인증 요청하기
      </button>
    </>
  );
};

export default Page;
