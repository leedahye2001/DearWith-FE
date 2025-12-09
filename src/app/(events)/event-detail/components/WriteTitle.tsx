"use client";

interface WriteTitleProps {
  id: number;
  question: React.ReactNode;
  answer?: React.ReactNode;
  wrapperClassName?: string;
  questionClassName?: string;
}

export default function WriteTitle({
  id,
  question,
  answer,
  wrapperClassName,
  questionClassName,
}: WriteTitleProps) {
  return (
    <div
      key={id}
      className={`flex justify-start items-start mb-[16px] gap-[6px] ${wrapperClassName}`}
    >
      <div className="flex justify-center items-center rounded-xl w-[16px] h-[16px] bg-primary text-text-1 font-[600] text-[10px] mt-[2px]">
        {id}
      </div>
      <div className="flex flex-col justify-start items-start">
        <h2
          className={`text-text-5 text-[14px] font-[600] ${questionClassName}`}
        >
          {question}
        </h2>
        <p className="text-text-4 text-[12px] font-[400]">{answer}</p>
      </div>
    </div>
  );
}
