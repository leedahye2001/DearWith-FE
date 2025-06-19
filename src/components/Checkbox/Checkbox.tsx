"use client";

import { twMerge } from "tailwind-merge";
import CheckboxDefaultIcon2 from "@/svgs/CheckboxDefaultIcon2.svg";
import CheckboxDefaultNeutral1100 from "@/svgs/CheckboxDefaultNeutral1100.svg";
import CheckboxFill from "@/svgs/CheckboxFill.svg";

interface CheckboxProps {
  _inputWrapperProps?: React.ComponentProps<"label">;
  _inputProps?: React.ComponentProps<"input">;
  _id: string;
  _value?: React.ReactNode;
  _checked?: boolean;
  _type?: "neutral1100" | "icon2";
  _onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({
  _inputWrapperProps,
  _inputProps,
  _value,
  _checked,
  _id,
  _type,
  _onChange,
}: CheckboxProps) => {
  const renderUncheckedIcon = () => {
    if (_type === "neutral1100") return <CheckboxDefaultNeutral1100 />;
    if (_type === "icon2") return <CheckboxDefaultIcon2 />;
    return null;
  };
  return (
    <label
      {..._inputWrapperProps}
      htmlFor={_id}
      className={twMerge(
        "flex justify-center items-end text-text-3 font-[400] text-[14px]",
        _inputWrapperProps?.className
      )}
    >
      {_checked ? <CheckboxFill /> : renderUncheckedIcon()}
      <input
        {..._inputProps}
        className="hidden"
        type="checkbox"
        id={_id}
        checked={_checked}
        onChange={_onChange}
      />
      {_value}
    </label>
  );
};
export default Checkbox;
