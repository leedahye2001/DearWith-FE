import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/lib/QueryProvider";
import Navbar from "@/components/template/Navbar";
import AlertModalClient from "@/components/AlertModal/AlertModalClient";

const mainFont = localFont({
  src: "../../public/font/Pretendard-Medium.otf",
  display: "swap",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "디어위드(DearWith)",
  description:
    "함께 만드는 소중한 하루, 아이돌 생일카페 정보 공유 플랫폼 ‘디어위드’ 입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="bg-bg-1">
      <body
        className={`${mainFont.className} ${inter.className} relative bg-bg-1`}
      >
        <QueryProvider>
          <div className="w-full max-w-[375px] mx-auto pb-[80px]">
            {children}
          </div>
          <AlertModalClient />
          <Navbar />
        </QueryProvider>
      </body>
    </html>
  );
}
