"use client";

interface ProgressbarProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

const Progressbar = ({
  totalSteps,
  currentStep,
  className,
}: ProgressbarProps) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div
      className={`w-full h-[3px] bg-[#e8e8e8] relative mb-[52px] ${
        className ?? ""
      }`}
    >
      <div
        className="h-full bg-primary absolute top-0 left-0 transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
};

export default Progressbar;
