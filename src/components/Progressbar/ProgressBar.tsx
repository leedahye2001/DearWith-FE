"use client";

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

const ProgressBar = ({
  totalSteps,
  currentStep,
  className,
}: ProgressBarProps) => {
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

export default ProgressBar;
