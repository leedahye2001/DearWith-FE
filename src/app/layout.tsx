import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/lib/QueryProvider";

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
    <html lang="ko" className="h-screen w-screen bg-white">
      <body
        className={`${mainFont.className} ${inter.className} relative h-full min-h-full min-w-[375px] bg-bg-1`}
      >
        <QueryProvider>
          <div className="flex w-full items-center justify-center">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
