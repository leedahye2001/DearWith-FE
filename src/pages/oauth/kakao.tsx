import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "@/app/stores/userStore";
import Spinner from "@/components/Spinner/Spinner";
import { BASE_URL } from "@/app/routePath";

const Kakao = () => {
  const router = useRouter();
  const kakaoCode = router.query.code as string; // 카카오에서 받은 code
  const [loading] = useState(true);

  const handleSocial = async () => {
    if (!kakaoCode) return;

    try {
      // 1️⃣ 먼저 로그인 시도
      const loginResponse = await axios.post(
        `https://${BASE_URL}/auth/oauth/kakao`,
        { code: kakaoCode },
        {
          withCredentials: true,
        }
      );

      const { needSignUp, signIn } = loginResponse.data;

      if (needSignUp) {
        // 2️⃣ 신규 회원 -> 닉네임 필요
        const nickname = prompt("닉네임을 입력해주세요."); // 간단하게 prompt로 받음
        if (!nickname) return;

        const signupResponse = await axios.post(
          `https://${BASE_URL}/users/signup/social`,
          {
            provider: "KAKAO",
            socialId: kakaoCode,
            nickname,
            agreements: [
              { type: "AGE_OVER_14", agreed: true },
              { type: "TERMS_OF_SERVICE", agreed: true },
              { type: "PERSONAL_INFORMATION", agreed: true },
              { type: "PUSH_NOTIFICATION", agreed: false },
            ],
          },
          { headers: { "Content-Type": "application/json;charset=utf-8" } }
        );

        const { userId, role } = signupResponse.data;

        useUserStore.getState().setUser({
          ...useUserStore.getState(),
          userId,
          nickname,
          role,
        });

        router.push("/main");
      } else {
        // 3️⃣ 기존 회원 -> 바로 로그인 처리
        const { userId, nickname, role } = signIn;

        useUserStore.getState().setUser({
          ...useUserStore.getState(),
          userId,
          nickname,
          role,
        });

        if (!nickname) {
          router.push("/set-nickname");
        } else {
          router.push("/main");
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("카카오 로그인/가입 오류:", err.response?.data || err);
      } else {
        console.error("알 수 없는 오류:", err);
      }
    }
  };

  useEffect(() => {
    handleSocial();
  }, [kakaoCode]);

  return loading ? <Spinner /> : null;
};

export default Kakao;
