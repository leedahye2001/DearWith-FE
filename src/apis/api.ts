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
  const res = await api.post("/users/signup", { email, password, nickname });
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

// 장소 (도로명 주소)
export const getRoadName = async (roadName: string) => {
  const res = await api.get(`/api/places/search?query=${roadName}`);
  console.log(res.data);
  return res.data;
};

// 아티스트 검색 (이벤트 등록페이지)
export const getArtist = async (artist: string) => {
  const res = await api.get(`/api/artists?query=${artist}`);
  console.log(res.data.content);
  return res.data.content;
};

// 아티스트 그룹 검색 (아티스트 등록페이지)
export const getGroup = async (group: string) => {
  const res = await api.get(`/api/groups?query=${group}`);
  console.log(res.data.content);
  return res.data.content;
};

// 메인 화면
export const getEventDetail = async (id: string) => {
  const res = await api.get(`/api/events/${id}`, {}); // 헤더에 token 자동 추가
  console.log(res.data);
  return res.data;
};
