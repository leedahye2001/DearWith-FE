import { BASE_URL } from "@/app/routePath";
import axios from "axios";

// email 인증 코드 발송
export const getMailSend = async (email: string) => {
  const res = await axios.post(
    `http://${BASE_URL}/auth/signup/email/send`,
    { email: email },
    {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        //   "Access-Control-Allow-Origin": "*",
      },
    }
  );

  console.log(res);
  return res.data.data;
};

// email 인증코드 발송
export const getMailVerify = async (email: string, code: string) => {
  const res = await axios.post(
    `http://${BASE_URL}/auth/signup/email/verify`,
    { email: email, code: code },
    {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        //   "Access-Control-Allow-Origin": "*",
      },
    }
  );

  console.log(res);
  return res.data.data;
};

// email 최종 회원가입
export const getMailSignUp = async (
  email: string,
  password: string,
  nickname: string
) => {
  const res = await axios.post(
    `http://${BASE_URL}/auth/signup`,
    { email: email, password: password, nickname: nickname },
    {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        //   "Access-Control-Allow-Origin": "*",
      },
    }
  );

  console.log(res);
  return res.data.data;
};
