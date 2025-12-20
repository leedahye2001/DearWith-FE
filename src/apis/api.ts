import { ReviewDetail } from "@/app/(events)/event-detail/components/EventReviewWrite";
import api, { refreshApi } from "./instance";

// email 인증 코드 발송
export const getMailSend = async (email: string) => {
  const res = await api.post("/auth/signup/email/send", { email, purpose: "SIGNUP" });
  return res.data.data;
};

// email 인증코드 확인
export const getMailVerify = async (email: string, code: string) => {
  const res = await api.post("/auth/signup/email/verify", { email, code, purpose: "SIGNUP" });
  return res.data;
};

// 회원가입
export const getMailSignUp = async (
  email: string,
  password: string,
  nickname: string,
  agreements: Array<{ type: string; agreed: boolean }>,
  emailTicket: string
) => {
  const res = await api.post("/users/signup", {
    email,
    password,
    nickname,
    agreements,
    emailTicket,
  });
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

// 토큰 유효성 검사
export const validateToken = async () => {
  const res = await refreshApi.post("/auth/validate", {});
  return res.data;
};

// 토큰 재발급
export const getRefreshToken = async () => {
  const res = await refreshApi.post(
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

// 아티스트 북마크(찜) 조회페이지
export const getArtistBookmark = async () => {
  const res = await api.get(`/api/my/artists/bookmark`,{});
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

export const getReviewDetail = async (
  reviewId: string,
  photoId: string
) => {
  const res = await api.get(`/api/reviews/${reviewId}/${photoId}`, {});
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

//아티스트 찜 하기
export const postArtistLike = async (artistId: string) => {
  return await api.post(`/api/artists/${artistId}/bookmark`);
};

//아티스트 찜 취소
export const deleteArtistLike = async (artistId: string) => {
  return await api.delete(`/api/artists/${artistId}/bookmark`);
};

//그룹 찜 하기
export const postGroupLike = async (groupId: string) => {
  return await api.post(`/api/groups/${groupId}/bookmark`);
};

//그룹 찜 취소
export const deleteGroupLike = async (groupId: string) => {
  return await api.delete(`/api/groups/${groupId}/bookmark`);
};

//시스템 공지사항 목록 조회
export const getSystemNotices = async () => {
  const res = await api.get(`/api/notices`, {});
  console.log(res.data);
  return res.data;
};

//시스템 공지사항 상세 조회
export const getSystemNoticeDetail = async (id: string) => {
  const res = await api.get(`/api/notices/${id}`, {});
  console.log(res.data);
  return res.data;
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

//검색 - id별 아티스트 이벤트 목록
export const getArtistEvents = async (artistId: string, sort: string) => {
  const res = await api.get(`/api/artists/${artistId}/events?sort=${sort}`);
  console.log(res.data);
  return res.data;
};

//검색 - id별 그룹 이벤트 목록
export const getGroupEvents = async (groupId: string, sort: string) => {
  const res = await api.get(`/api/groups/${groupId}/events?sort=${sort}`);
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
  return await api.delete(`/api/search/recent/delete?query=${query}`);
};

//최근 검색어 전체 삭제
export const deletRecentAllSearch = async () => {
  return await api.delete(`/api/search/recent/delete/all`);
};

//마이페이지 조회
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
export const getMyRegisterEvent = async () => {
  const res = await api.get(`/api/my/events`);
  console.log(res.data);
  return res.data;
};

// 내가 작성한 리뷰 조회
export const getMyRegisterReview = async () => {
  const res = await api.get(`/api/my/reviews`);
  console.log(res.data);
  return res.data;
};

// 현재 로그인 회원 정보 조회
export const getUserInfo = async () => {
  const res = await api.get(`/users/me`);
  console.log(res.data);
  return res.data;
};

// 회원 탈퇴
export type WithdrawReason = "NO_LONGER_NEEDED" | "LACK_OF_INFO" | "TOO_COMMERCIAL" | "OTHER";

export const withdrawUser = async (reason: WithdrawReason, detail: string) => {
  const res = await api.post(
    "/users/me",
    {
      reason,
      detail,
    },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

// 기존 함수명 유지 (하위 호환성)
export const deleteUserAccount = async () => {
  return await withdrawUser("NO_LONGER_NEEDED", "디어위드를 더 이상 사용하지 않아서 탈퇴합니다.");
};

// 프로필 사진 삭제
export const deleteProfileImage = async () => {
  return await api.delete(`/users/me/profile/image`, {});
};

// 프로필 사진 추가/수정
export const updateProfileImage = async (tmpKey: string) => {
  const res= await api.patch(`/users/me/profile/image`, { tmpKey });
  console.log(res.data);
  return res.data;
};

export const requestPresignedUrl = async (params: {
  filename: string;
  contentType: string;
  domain: string;
}) => {
  const res = await api.post("/api/uploads/presign", params, {
    headers: { "Content-Type": "application/json" },
  });

  return res.data;
};

export const uploadToS3 = async (file: File, uploadUrl: string) => {
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
};

export const commitUpload = async (tmpKey: string) => {
  const res = await api.post("/api/uploads/commit", { tmpKey });
  return res.data;
};

// 기존 비밀번호 조회 (현재 비밀번호 확인)
export const getPasswordVerify = async (currentPassword: string) => {
  const res = await api.post("/users/me/password/verify", {currentPassword});
  return res.data;
};

// 비밀번호 변경
export const getPasswordConfirm = async (newPassword: string) => {
  const res = await api.post("/users/password/change", {newPassword});
  return res.data;
};

// 내 문의사항 목록 조회
export const getMyInquiryList = async () => {
  const res = await api.get("/api/inquiries/my");
  return res.data;
};

// 내 문의사항 상세 조회
export const getMyInquiryDetail = async (inquiryId:string) => {
  const res = await api.get(`/api/inquiries/${inquiryId}`);
  return res.data;
};

// 문의사항 등록하기
export const registerInquiry = async (
  title: string,
  content: string,
) => {
  const res = await api.post("/api/inquiries", { title, content });
  return res.data.data;
};


// 답변 만족도 조사
export const answerSatisfaction = async (
  inquiryId: string,
  satisfactionStatus: string,
) => {
  const res = await api.post(`/api/inquiries/${inquiryId}/satisfaction`, {satisfactionStatus});
  return res.data;
};


// 푸시 기기 등록/갱신 
export type PlatformType = "IOS" | "ANDROID";

export const postPushDevice = async (payload: {
  deviceId: string;
  fcmToken: string;
  platform: PlatformType;
  phoneModel?: string;
  osVersion?: string;
}) => {
  const res = await api.post("/api/push/devices", payload, {
    withCredentials: true,
  });
  return res.data;
};

// 리뷰 신고
export type ReportReason = "OFF_TOPIC" | "HATE" | "SPAM" | "OTHER";

export const reportReview = async (
  reviewId: string,
  reason: ReportReason,
  content: string
) => {
  const res = await api.post(`/api/reviews/${reviewId}/report`, {
    reason,
    content,
  });
  return res.data;
};