import { twMerge } from "tailwind-merge";

interface PopupProps {
  _divProps?: React.ComponentProps<"div">;
  _titleNode?: React.ReactNode;
  _buttonNode?: React.ReactNode;
}

const Popup = ({ _divProps, _titleNode, _buttonNode }: PopupProps) => {
  return (
    <div className="fixed inset-0 z-40 flex justify-center items-end">
      <div className="absolute inset-0 bg-black/50" />

      <div
        {..._divProps}
        className={twMerge(
          "relative bg-bg-1 w-full rounded-t-[12px] z-50",
          _divProps?.className
        )}
      >
        {/* 타이틀 */}
        <div className="mt-[40px] mb-[28px] flex justify-center">
          <h1 className="w-full text-center font-[600] text-[16px] text-[#252525]">
            {_titleNode}
          </h1>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center mb-[24px]">{_buttonNode}</div>
      </div>
    </div>
  );
};

export default Popup;
