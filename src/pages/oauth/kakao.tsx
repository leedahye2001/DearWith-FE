import LocalStorage from "@/utils/localStorage";
import { BASE_URL } from "@/app/routePath";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Kakao = () => {
  const router = useRouter();
  const validateCode = router.query.code as string;

  const getToken = async () => {
    if (!validateCode) {
      return;
    }

    try {
      await axios.get(
        `http://localhost:3000/oauth/kakao?code=${validateCode}`,
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      );
      console.log(validateCode);
      console.log("1차 카카오 응답 완료");
      LocalStorage.setItem("validateCode", validateCode);

      const finalResponse = await axios.post(
        `http://${BASE_URL}/auth/oauth/kakao`,
        { code: validateCode },
        {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      );

      console.log("2차 최종 응답 데이터:", finalResponse.data.message);
      if (finalResponse.data.userId !== null) {
        router.push("/mail-send");
      } else {
        console.log("err");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    getToken();
  }, [validateCode]);

  return (
    <>
      <div>카카오 로그인 진행 중입니다.</div>
    </>
  );
};

export default Kakao;
