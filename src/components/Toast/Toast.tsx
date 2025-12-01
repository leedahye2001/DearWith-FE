"use client";

interface ToastProps {
  content: string;
  visible: boolean;
}

export default function Toast({ content, visible }: ToastProps) {
  return (
    <div
      className={`fixed bottom-[120px] left-1/2 -translate-x-1/2 px-[16px] py-[8px] bg-bg-2 text-text-4 text-[14px] rounded-[4px] transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }
      `}
    >
      {content}
    </div>
  );
}
