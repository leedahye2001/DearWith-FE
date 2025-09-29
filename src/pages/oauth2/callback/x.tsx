import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
// import { BASE_URL } from "@/app/routePath";
import useAuthStore from "@/app/stores/useXAuthStore";

const X = () => {
  const router = useRouter();
  const { state, code } = router.query;
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (!state || !code) return;

    const verifyX = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/oauth2/callback/x?${state}=state&${code}=code`
        );
        const data = res.data;
        console.log("data", data);
        if (data.verified) {
          setAuth({
            twitterHandle: data.twitterHandle,
            twitterId: data.twitterId,
            twitterName: data.twitterName,
          });
          router.push("/event-register"); // 인증 성공 시 이동
        } else {
          console.warn("X 인증 실패");
          // router.push("/login"); // 실패 시 로그인 페이지
        }
      } catch (err) {
        console.error("X 인증 처리 중 오류:", err);
      }
    };

    verifyX();
  }, [state, code, router, setAuth]);

  return <div>로그인 확인 중...</div>;
};

export default X;
