import { twMerge } from "tailwind-merge";

interface TopbarProps {
  _leftImage?: React.ReactNode;
  _topNode?: React.ReactNode;
  _rightImage?: React.ReactNode;
  _divProps?: React.ComponentProps<"div">;
  _leftDivProps?: React.ComponentProps<"div">;
  _RightDivProps?: React.ComponentProps<"div">;
}

const Topbar = ({
  _leftImage,
  _topNode,
  _rightImage,
  _divProps,
  _leftDivProps,
  _RightDivProps,
}: TopbarProps) => {
  return (
    <div
      {..._divProps}
      className={twMerge(
        "flex justify-between items-center px-[24px] w-[360px] h-[48px] bg-white text-text-5 font-[700]",
        _divProps?.className
      )}
    >
      {_leftImage && _leftImage ? (
        <div
          {..._leftDivProps}
          className={twMerge("flex items-center w-[24px] h-[24px]")}
        >
          {_leftImage}
        </div>
      ) : (
        <div className="w-[24px] h-[24px]" />
      )}
      {_topNode}
      {_rightImage && _rightImage ? (
        <div
          {..._RightDivProps}
          className={twMerge("flex items-center w-[24px] h-[24px]")}
        >
          {_rightImage}
        </div>
      ) : (
        <div className="w-[24px] h-[24px]" />
      )}
    </div>
  );
};

export default Topbar;
