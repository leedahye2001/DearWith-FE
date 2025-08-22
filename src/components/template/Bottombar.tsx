import { twMerge } from "tailwind-merge";

interface BottombarProps {
  _divProps?: React.ComponentProps<"div">;
  _bottomNode?: React.ReactNode;
}

const Bottombar = ({ _divProps, _bottomNode }: BottombarProps) => {
  return (
    <div
      {..._divProps}
      className={twMerge(
        "fixed bottom-0 z-20 px-[24px] pb-[80px]",
        _divProps?.className
      )}
    >
      {_bottomNode}
    </div>
  );
};

export default Bottombar;
