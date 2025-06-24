"use client";

import { getMailVerify } from "@/apis/api";
import useUserStore from "@/app/stores/userStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();

  const { email } = useUserStore();
  const [inputEmail, setInputEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(e.target.value);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const fetchMailData = async () => {
    try {
      await getMailVerify(inputEmail, code);
      alert("인증되었습니다.");
      router.push("/mail-signup");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <h1>이메일 인증을 완료해 주세요</h1>
      <p>이메일</p>
      {email}
      <input
        className="w-full border border-2"
        type="text"
        value={inputEmail}
        onChange={handleMailChange}
      />
      <p>인증코드</p>
      <input
        className="w-full border border-2"
        type="text"
        value={code}
        onChange={handleCodeChange}
      />
      <button onClick={fetchMailData}>이메일 인증 완료하기</button>
    </>
  );
};

export default Page;
