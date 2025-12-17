import { twMerge } from "tailwind-merge";

interface ButtonProps {
  _buttonProps?: React.ComponentProps<"button">;
  _node?: React.ReactNode;
  _state?: "main" | "sub" | "tag";
  _onClick?: () => void;
  _rightNode?: React.ReactNode;
}

const ButtonClasses = {
  main: "bg-primary w-full h-[44px] text-text-1 text-[14px] font-[600] rounded-[4px]",
  sub: "w-full min-h-[24px] rounded-[4px] border-[1px] border-divider-1 font-[600] text-[12px] text-text-3 px-[8px] py-[4px]",
  tag: "flex justify-center items-center h-[24px] border-[1px] border-primary rounded-[4px] font-[600] text-[12px] text-text-5 gap-1 p-[8px]",
};

const Button = ({
  _buttonProps,
  _node,
  _state,
  _rightNode,
  _onClick,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {..._buttonProps}
      className={twMerge(
        _state ? ButtonClasses?.[_state] : "",
        _buttonProps?.className
      )}
      {...rest}
      onClick={_onClick}
    >
      {_node}
      {_state === "tag" && _rightNode && <div>{_rightNode}</div>}
    </button>
  );
};

export default Button;
