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
      <div className="flex justify-center items-center rounded-xl w-[16px] h-[16px] bg-primary text-text-1 typo-label4 mt-[2px]">
        {id}
      </div>
      <div className="flex flex-col justify-start items-start">
        <h2
          className={`text-text-5 typo-label2 ${questionClassName}`}
        >
          {question}
        </h2>
        <p className="text-text-4 typo-caption3">{answer}</p>
      </div>
    </div>
  );
}
