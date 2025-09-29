"use client";
import { useRouter } from "next/navigation";

interface FABProps {
  _url?: string;
  _node?: React.ReactNode;
}

export const FAB = ({ _url, _node }: FABProps) => {
  const router = useRouter();

  return (
    <button
      className="fixed right-0 bottom-0 p-[10px] w-[44px] h-[44px] bg-primary rounded-full shadow-md mb-[32px] mr-[20px] hover:cursor-pointer"
      onClick={() => {
        router.push(`${_url}`);
      }}
    >
      {_node && <div>{_node}</div>}
    </button>
  );
};
