"use client";

import { getMailSignUp } from "@/apis/api";
import { useState } from "react";

const Page = () => {
  //   const { data } = useQuery({
  //     queryKey: ["data"],
  //     queryFn: getMailSend,
  //   });

  const [email, setEmail] = useState<string>("");
  // const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setCode(e.target.value);
  // };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const fetchMailData = async () => {
    try {
      // await getMailSend(email);

      // await getMailVerify(email, code);
      await getMailSignUp(email, password, nickname);
      alert(
        "이메일로 코드가 전송되었습니다. 전송된 인증 코드를 아래에 입력해주세요."
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <form>
        <p>email: </p>
        <input
          className="w-full border border-2"
          type="text"
          value={email}
          onChange={handleMailChange}
        />
      </form>
      <form>
        <p>password: </p>
        <input
          className="w-full border border-2"
          type="text"
          value={password}
          onChange={handlePasswordChange}
        />
      </form>
      <form>
        <p>nickname: </p>
        <input
          className="w-full border border-2"
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
        />
      </form>
      <button onClick={fetchMailData}>회원가입</button>
    </>
  );
};

export default Page;
