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
        "flex justify-between items-center text-text-5 font-[700] px-[24px] h-[48px] mt-[54px]",
        _divProps?.className
      )}
    >
      {_leftImage ? (
        <div
          {..._leftDivProps}
          className={twMerge(
            "flex items-center hover:cursor-pointer",
            _leftDivProps?.className
          )}
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
