"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "../../stores/userStore";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import KakaoLogo from "@/svgs/KakaoLogo.svg";
import ViewDefault from "@/svgs/ViewDefault.svg";
import ViewOn from "@/svgs/ViewOn.svg";

import {
  isNativeApp,
  requestEmailLogin,
  requestKakaoLogin,
  requestAppleLogin,
  isAppleNative,
} from "@/lib/native/bridge";
import { getSignIn, validateToken } from "@/apis/api";

type NativeSocialSignInPayload =
  | { error: true; code: string; message: string }
  | {
      error?: false;
      needSignUp: boolean;
      provider?: string;
      socialId?: string;
      signIn?: { message?: string; userId: string; nickname: string; role: string } | null;
    };

type NativeEmailLoginPayload =
  | { error: true; code: string; message: string }
  | {
      error?: false;
      signIn: { message?: string; userId: string; nickname: string; role: string };
    };

const KAKAO_AUTH_URL =
  "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=a1c8f8ab77b2ad88da439427df5c5226&redirect_uri=https://www.dearwith.kr/oauth/kakao";

const SOCIAL_SIGNUP_KEY = "dearwith:socialSignUp";

const Page = () => {
  const router = useRouter();

  const [inputEmail, setInputEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("영문, 숫자, 특수문자 포함 8자리 이상");

  // hydration 방지: 마운트 이후에만 Apple 버튼 여부 결정
  const [showAppleButton, setShowAppleButton] = useState(false);

  useEffect(() => {
    setShowAppleButton(isAppleNative());
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await validateToken();
        router.replace("/main");
      } catch {
        // 인증 실패 시 로그인 페이지로 이동하지 않음 (기본 동작 유지)
      }
    };

    checkAuth();
  }, [router]);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/;

  const togglePassword = () => setShowPassword((p) => !p);
  const handleEmailChange = (v: string) => setInputEmail(v);

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    setPasswordError(passwordRegex.test(v) ? "" : "영문, 숫자, 특수문자 포함 8자리 이상");
  };

  const emailErrorMessage =
    inputEmail && !inputEmail.trim().toLowerCase().endsWith(".com") ? "메일 형식이 올바르지 않습니다" : "";

  const fetchSignInData = async () => {
    // 앱: 이메일 로그인도 네이티브에게 위임(웹뷰->네이티브로 email/password 전달)
    if (isNativeApp()) {
      const ok = requestEmailLogin(inputEmail, password);
      if (!ok) setPasswordError("앱 로그인 기능을 사용할 수 없습니다.");
      return;
    }

    // 웹: 기존 /auth/signin (쿠키 or 서버 정책대로)
    try {
      const response = await getSignIn(inputEmail, password);
      useUserStore.getState().setUser({
        message: response.message ?? "",
        userId: response.userId,
        nickname: response.nickname,
        role: response.role,
      });
      router.push("/main");
    } catch {
      setPasswordError("비밀번호를 다시 입력해주세요.");
    }
  };

  const handleSignup = () => router.push("/agreement");

  const handleKakaoLogin = () => {
    const ok = requestKakaoLogin();
    if (ok) return;
    window.location.href = KAKAO_AUTH_URL; // 웹 fallback
  };

  const handleAppleLogin = () => {
    requestAppleLogin();
  };

  // 네이티브 소셜 결과 처리(카카오/애플)
  const handleNativeSocialResult = useCallback((payload: NativeSocialSignInPayload, label: "KAKAO" | "APPLE") => {
    if (!payload) return;

    if ("error" in payload && payload.error) {
      console.error(`${label} native login error:`, payload.code, payload.message);
      return;
    }

    if (payload.needSignUp) {
      try {
        sessionStorage.setItem(
          SOCIAL_SIGNUP_KEY,
          JSON.stringify({ provider: payload.provider, socialId: payload.socialId })
        );
      } catch {}
      router.push("/agreement");
      return;
    }

    const signIn = payload.signIn;
    if (!signIn?.userId) return;

    useUserStore.getState().setUser({
      message: signIn.message ?? "",
      userId: signIn.userId,
      nickname: signIn.nickname,
      role: signIn.role,
    });

    router.push("/main");
  }, [router]);

  // 네이티브 이메일 결과 처리(needSignUp 없음)
  const handleNativeEmailResult = useCallback((payload: NativeEmailLoginPayload) => {
    if (!payload) return;

    if ("error" in payload && payload.error) {
      setPasswordError(payload.message ?? "로그인 실패");
      return;
    }

    const signIn = payload.signIn;
    useUserStore.getState().setUser({
      message: signIn.message ?? "",
      userId: signIn.userId,
      nickname: signIn.nickname,
      role: signIn.role,
    });

    router.push("/main");
  }, [router]);

  // Native -> Web 콜백 등록
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.dearwithAuth = window.dearwithAuth || {};

    window.dearwithAuth.onKakaoLoginComplete = (payload) => handleNativeSocialResult(payload, "KAKAO");
    window.dearwithAuth.onAppleLoginComplete = (payload) => handleNativeSocialResult(payload, "APPLE");
    window.dearwithAuth.onEmailLoginComplete = (payload) => handleNativeEmailResult(payload);

    return () => {
      if (window.dearwithAuth?.onKakaoLoginComplete) delete window.dearwithAuth.onKakaoLoginComplete;
      if (window.dearwithAuth?.onAppleLoginComplete) delete window.dearwithAuth.onAppleLoginComplete;
      if (window.dearwithAuth?.onEmailLoginComplete) delete window.dearwithAuth.onEmailLoginComplete;
    };
  }, [router, handleNativeSocialResult, handleNativeEmailResult]);

  return (
    <div className="bg-bg-1 dark:bg-bg-1 flex flex-col justify-center items-center px-[24px] min-h-screen">
      <h1 className="w-full text-left font-[700] text-text-5 text-[20px] pb-[40px]">
        반가워요👋
        <br />
        디어위드와 함께
        <br />
        생카를 즐겨볼까요?
      </h1>

      <div className="w-full">
        <Input
          _value={inputEmail}
          _state="textbox-underline"
          _title="이메일"
          _bottomNode={emailErrorMessage}
          _onChange={handleEmailChange}
          _containerProps={{ className: "pb-[20px]" }}
          _inputProps={{
            placeholder: "이메일을 입력해주세요.",
            className: "placeholder:text-text-3",
          }}
        />
        <Input
          _value={password}
          _state="textbox-underline"
          _title="비밀번호"
          _onChange={handlePasswordChange}
          _inputProps={{
            type: showPassword ? "text" : "password",
            placeholder: "비밀번호를 입력해주세요.",
            className: "placeholder:text-text-3",
          }}
          _rightNode={
            <button type="button" onClick={togglePassword}>
              {showPassword ? <ViewOn /> : <ViewDefault />}
            </button>
          }
          _containerProps={{ className: "pb-[55px]" }}
          _bottomNode={password && passwordError}
        />
      </div>

      <Button _state="main" _node="로그인" _buttonProps={{ className: "hover:cursor-pointer mb-[12px]" }} _onClick={fetchSignInData} />

      <div className="flex text-[12px] font-[400] gap-[16px]">
        <p onClick={() => router.push("/find-password")} className="hover:cursor-pointer">비밀번호 찾기</p>
        <p>|</p>
        <p onClick={handleSignup} className="hover:cursor-pointer">회원가입</p>
      </div>

      <div className="flex items-center pt-[40px] pb-[12px] w-full">
        <div className="flex-grow h-[1px] bg-divider-1" />
        <p className="text-[12px] font-[600] px-[10px] whitespace-nowrap">또는</p>
        <div className="flex-grow h-[1px] bg-divider-1" />
      </div>

      <Button
        _state="main"
        _node={
          <div className="flex justify-between items-center p-[10px]">
            <KakaoLogo />
            <span className="text-[#191919] text-[14px] font-[600]">
              카카오로 시작하기
            </span>
            <div className="w-[18px]" />
          </div>
        }
        _buttonProps={{
          className: "hover:cursor-pointer bg-[#FEE500] text-[#191919]",
        }}
        _onClick={handleKakaoLogin}
      />

      {showAppleButton && (
        <Button
          _state="main"
          _node={
            <div className="flex justify-between items-center p-[10px]">
              <KakaoLogo />
              <span className="text-white text-[14px] font-[600]">
                Apple로 시작하기
              </span>
              <div className="w-[18px]" />
            </div>
          }
          _buttonProps={{
            className: "mt-[8px] hover:cursor-pointer bg-black",
          }}
          _onClick={handleAppleLogin}
        />
      )}
    </div>
  );
};

export default Page;
