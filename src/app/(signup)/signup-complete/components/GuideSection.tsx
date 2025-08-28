"use client";

interface GuideProps {
  id: number;
  question: React.ReactNode;
  answer: React.ReactNode;
}

export default function GuideSection({ id, question, answer }: GuideProps) {
  return (
    <div
      key={id}
      className="flex flex-col justify-center items-start mb-[24px]"
    >
      <div className="flex justify-center items-center rounded-xl w-[16px] h-[16px] bg-primary text-text-1 font-[600] text-[10px] mb-[8px]">
        {id}
      </div>
      <h2 className="text-text-5 text-[14px] font-[600] mb-[4px]">
        {question}
      </h2>
      <p className="text-text-4 text-[12px] font-[400]">{answer}</p>
    </div>
  );
}
