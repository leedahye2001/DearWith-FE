"use client";

import { getMailSignUp } from "@/apis/api";
import { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const fetchMailData = async () => {
    try {
      await getMailSignUp(email, password, nickname);
      alert("가입이 완료되었습니다");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <h1>비밀번호와 닉네임을 입력해 주세요</h1>
      <p>email: </p>
      <input
        className="w-full border border-2"
        type="text"
        value={email}
        onChange={handleMailChange}
      />
      <p>password: </p>
      <input
        className="w-full border border-2"
        type="text"
        value={password}
        onChange={handlePasswordChange}
      />
      <p>nickname: </p>
      <input
        className="w-full border border-2"
        type="text"
        value={nickname}
        onChange={handleNicknameChange}
      />
      <button onClick={fetchMailData}>등록하기</button>
    </>
  );
};

export default Page;
