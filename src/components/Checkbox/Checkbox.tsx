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
  _onChange?: (checked: boolean) => void;
}

const Checkbox = ({
  _inputWrapperProps,
  _inputProps,
  _value,
  _id,
  _type,
  _checked = false,
  _onChange,
}: CheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    _onChange?.(e.target.checked);
  };

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
        "flex items-center gap-[11px] text-text-3 text-[14px] cursor-pointer",
        _inputWrapperProps?.className
      )}
    >
      <div className="flex items-center justify-center flex-shrink-0">
        {_checked ? <CheckboxFill /> : renderUncheckedIcon()}
      </div>
      <input
        {..._inputProps}
        className="hidden"
        type="checkbox"
        id={_id}
        checked={_checked}
        onChange={handleChange}
      />
      <div className="flex items-center">
        {_value}
      </div>
    </label>
  );
};

export default Checkbox;
