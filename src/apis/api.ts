import { ReviewDetail } from "@/app/(events)/event-detail/components/EventReviewWrite";
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
  const res = await api.post(
    "/auth/signin",
    { email, password },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

// 토큰 재발급
export const getRefreshToken = async () => {
  const res = await api.post(
    "/auth/refresh",
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
};

// 로그아웃
export const postLogout = async () => {
  const res = await api.post(
    "/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
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

// 통합 검색 (아티스트, 그룹 둘 다 검색 가능)
export const getArtistGroupSearch = async (keyword: string) => {
  const res = await api.get(`/api/search/artists?query=${keyword}`);

  const combined = res.data?.content || [];

  console.log(combined); // 확인용
  return combined;
};

// 이벤트 검색
export const getEventSearch = async (event: string) => {
  const res = await api.get(`/api/events?query=${event}`);
  console.log(res.data.content);
  return res.data.content;
};

// 이벤트 상세페이지
export const getEventDetail = async (id: string) => {
  const res = await api.get(`/api/events/${id}`, {});
  console.log(res.data);
  return res.data;
};

// 이벤트 북마크(찜) 조회페이지
export const getEventBookmark = async (filterState: string) => {
  const res = await api.get(`/api/events/bookmark?state=${filterState}`, {});
  console.log(res.data.content);
  return res.data.content;
};

// 이벤트 리뷰 목록
export const getEventReviewDetail = async (id: string) => {
  const res = await api.get(`/api/events/${id}/reviews`, {});
  console.log(res.data);
  return res.data;
};

// 이벤트 리뷰 사진
export const getEventPhotoReviews = async (id: string) => {
  const res = await api.get(`/api/events/${id}/photoReviews`);
  console.log(res.data);
  return res.data;
};

export const postReviewLike = async (reviewId: string) => {
  return await api.post(`/api/reviews/${reviewId}/like`);
};

export const deleteReviewLike = async (reviewId: string) => {
  return await api.delete(`/api/reviews/${reviewId}/like`);
};

export const patchEventReviewDetail = async (
  reviewId: string,
  data: Partial<ReviewDetail>
) => {
  const res = await api.patch(`/api/reviews/${reviewId}`, data);
  return res.data;
};

// 핫 아티스트/그룹 Top 20
export const getHotArtistGroupTopTwenty = async () => {
  const res = await api.get(`/api/search/artists/artists-groups`);
  console.log(res.data);
  return res.data;
};

// 이벤트 공지사항 목록
export const getEventNoticeList = async (id: string) => {
  const res = await api.get(`/api/events/${id}/notices`, {});
  console.log(res.data);
  return res.data;
};

// 이벤트 공지사항 상세 목록
export const getEventNoticeDetail = async (id: string) => {
  const res = await api.get(`/api/events/notices/${id}`, {});
  console.log(res.data);
  return res.data;
};

//이벤트 찜 하기
export const postEventLike = async (reviewId: string) => {
  return await api.post(`/api/events/${reviewId}/bookmark`);
};

//이벤트 찜 취소
export const deleteEventLike = async (reviewId: string) => {
  return await api.delete(`/api/events/${reviewId}/bookmark`);
};

//이벤트 공지 등록 /api/events/{eventId}/notices
export const eventNoticePost = async (
  title: string,
  content: string,
  eventId: string
) => {
  const res = await api.post(`/api/events/${eventId}/notices`, {
    title,
    content,
  });
  return res.data;
};

//이벤트 공지 삭제
export const deleteEventPost = async (eventId: string, noticeId: string) => {
  return await api.delete(` /api/events/${eventId}/notices/${noticeId}`);
};

export const getArtistEvents = async (artistId: string, sort: string) => {
  const res = await api.get(`/api/artists/${artistId}/events?sort=${sort}`);
  console.log(res.data);
  return res.data;
};

//알림 목록 조회
export const getAlertMessage = async () => {
  const res = await api.get(`/api/notifications`);
  const data = res.data;

  // 배열인지 확인 후 반환
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content;
  if (data.content?.content && Array.isArray(data.content.content))
    return data.content.content;

  console.error("알림 데이터 형식이 예상과 다릅니다:", data);
  return [];
};

export const getUnreadNotifications = async () => {
  const res = await api.get(`/api/notifications/unread-exists`);
  console.log(res.data);
  return res.data;
};

//최근 검색어 조회
export const getRecentSearch = async () => {
  const res = await api.get(`/api/search/recent`);
  console.log(res.data);
  return res.data;
};

//최근 검색어 추가
export const addRecentSearch = async (query: string) => {
  const res = await api.post("/api/search/recent/add", query);
  return res.data;
};

//최근 검색어 삭제
export const deletRecentSearch = async (query: string) => {
  return await api.delete(`/api/search/recent/delete/${query}`);
};

//최근 검색어 전체 삭제
export const deletRecentAllSearch = async () => {
  return await api.delete(`/api/search/recent/delete/all`);
};

//최근 검색어 조회
export const getMyPage = async () => {
  const res = await api.get(`/api/my`);
  console.log(res.data);
  return res.data;
};

// 서비스 알림 설정 변경
export const updateServiceNotifications = async (enabled: boolean) => {
  const res = await api.patch("/api/my/notifications/service", { enabled });
  console.log(res.data);
  return res.data;
};

// 이벤트 알림 설정 변경
export const updateEventNotifications = async (enabled: boolean) => {
  const res = await api.patch("/api/my/notifications/event", { enabled });
  console.log(res.data);
  return res.data;
};

// 내가 등록한 아티스트 조회
export const getMyRegisterArtist = async () => {
  const res = await api.get(`/api/my/artists`);
  console.log(res.data);
  return res.data;
};

// 내가 등록한 아티스트 조회
export const getMyEventArtist = async () => {
  const res = await api.get(`/api/my/events`);
  console.log(res.data);
  return res.data;
};
