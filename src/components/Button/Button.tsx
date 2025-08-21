import { twMerge } from "tailwind-merge";

interface ButtonProps {
  _buttonProps?: React.ComponentProps<"button">;
  _node?: React.ReactNode;
  _state?: "main" | "sub" | "tag";
  _onClick?: () => void;
}

const ButtonClasses = {
  main: "bg-primary w-[312px] h-[44px] text-text-1 text-[14px] font-[600] rounded-[4px]",
  sub: "w-[37px] h-[24px] rounded-[4px] border-[1px] border-divider-1 font-[600] text-[12px] text-text-3",
  tag: "flex justify-center items-center w-[49px] h-[24px] border-[1px] border-primary rounded-[4px] font-[600] text-[12px] text-text-5 gap-1",
};

const Button = ({
  _buttonProps,
  _node,
  _state,
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
      {_state && _state == "tag" && (
        <div className="rounded-xl border-[1px] w-[10px] h-[10px] border-primary" />
      )}
    </button>
  );
};

export default Button;
