import { BASE_URL } from "@/app/routePath";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useUserStore from "@/app/stores/userStore";

const Kakao = () => {
  const router = useRouter();
  const kakaoCode = router.query.code as string;

  const getToken = async () => {
    if (!kakaoCode) return;

    try {
      await axios.get(`http://localhost:3000/oauth/kakao?code=${kakaoCode}`, {
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });

      const finalResponse = await axios.post(
        `http://${BASE_URL}/auth/oauth/kakao`,
        { code: kakaoCode },
        { headers: { "Content-Type": "application/json;charset=utf-8" } }
      );
      console.log("카카오 로그인 서버 응답:", finalResponse.data);
      const { message, userId, nickname, role, token, refreshToken } =
        finalResponse.data;

      const userStore = useUserStore.getState();
      if (token) {
        useUserStore.getState().setUser({
          ...userStore,
          message,
          userId,
          nickname,
          role,
          token,
          refreshToken,
        });
      }

      if (userId) {
        if (nickname === null) {
          // 신규회원: 닉네임 없음 → 닉네임 설정 페이지
          router.push("/set-nickname");
        } else {
          // 기존회원: 닉네임 존재 → 메인 페이지
          router.push("/main");
        }
      } else {
        console.log("유저 정보 없음");
      }
    } catch (err) {
      console.error("카카오 로그인 처리 중 오류:", err);
    }
  };

  useEffect(() => {
    getToken();
  }, [kakaoCode]);

  return <div>카카오 로그인 진행 중입니다...</div>;
};

export default Kakao;
