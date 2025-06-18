"use client";

// import { getMailSend } from "@/apis/api";
import Input from "@/components/Input/Input";
import { useState } from "react";
// import { useRouter } from "next/navigation";

const Page = () => {
  // const router = useRouter();

  // const fetchMailData = async () => {
  //   try {
  //     // await getMailSend(email);
  //     alert(
  //       "이메일로 코드가 전송되었습니다. 전송된 인증 코드를 아래에 입력해주세요."
  //     );
  //     router.push("/mail-verify");
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const [text, setText] = useState<string>("");

  const handleTextChange = (text: string) => {
    setText(text);
  };

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex justify-center">
      {/* <h1>디어위드에서 사용할 이메일을 입력해 주세요</h1> */}
      <Input
        _value={text}
        _state="textbox-underline"
        _title="제목"
        _view
        _onChange={handleTextChange}
        _timer={10}
      />
      {/* <button className="hover:cursor-pointer" onClick={fetchMailData}>
        이메일 인증 요청하기
      </button> */}
    </div>
  );
};

export default Page;
