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
        "fixed bottom-0 left-0 right-0 z-20 mx-[24px] mb-[52px]",
        _divProps?.className
      )}
    >
      {_bottomNode}
    </div>
  );
};

export default Bottombar;
