import api from "./instance";

// email 인증 코드 발송
export const getMailSend = async (email: string) => {
  const res = await api.post("/auth/signup/email/send", { email });
  return res.data.data;
};

// email 인증코드 확인
export const getMailVerify = async (email: string, code: string) => {
  const res = await api.post("/auth/signup/email/verify", { email, code });
  return res.data.data;
};

// 회원가입
export const getMailSignUp = async (
  email: string,
  password: string,
  nickname: string
) => {
  const res = await api.post("/auth/signup", { email, password, nickname });
  return res.data.data;
};

// 닉네임 중복확인
export const getNicknameCheck = async (nickname: string) => {
  const res = await api.get("/users/check/nickname", { params: { nickname } });
  console.log(res.data);
  return res.data;
};

// 닉네임 업데이트
export const updateNickname = async (nickname: string) => {
  const res = await api.patch("/users/me/nickname", { nickname });
  console.log(res.data);
  return res.data;
};

// 로그인
export const getSignIn = async (email: string, password: string) => {
  const res = await api.post("/auth/signin", { email, password });
  return res.data;
};

// 메인 화면
export const getMain = async () => {
  const res = await api.get("/api/main", {}); // 헤더에 token 자동 추가
  console.log(res.data);
  return res.data;
};
