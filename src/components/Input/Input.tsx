"use client";

import Countdown from "@/utils/Countdown";
import View from "@/svgs/view.svg";
import { twMerge } from "tailwind-merge";

interface BasicInputProps {
  _wrapperProps?: React.ComponentProps<"div">;
  _inputProps?: React.ComponentProps<"input">;
  _state?: "textbox-basic" | "textbox-underline";
  _bottomNode?: React.ReactNode;
  _onChange?: (value: string) => void;
  _value?: string;
  _view?: boolean;
  _title?: string;
  _timer?: number;
}

const inputWrapperClasses = {
  "textbox-basic":
    "flex w-[312px] h-[44px] p-[10px] border border-divider-2 border-[1px] rounded-[4px] justify-between",
  "textbox-underline":
    "flex w-[312px] h-[44px] py-[10px] border-divider-2 border-b-[1px] justify-between",
};

const inputClasses = {
  common:
    "flex items-center justify-center text-[14px] font-[400] text-text-3 min-w-[200px] outline-none h-[20px]",
};

const Input = ({
  _wrapperProps,
  _inputProps,
  _state,
  _bottomNode,
  _onChange,
  _value,
  _view,
  _title,
  _timer,
}: BasicInputProps & { _value: string }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (_onChange) {
      _onChange(value);
    }
  };

  return (
    <div className="flex flex-col">
      {_title && <h1 className="text-[14px] font-[600]">{_title}</h1>}
      <div
        {..._wrapperProps}
        className={twMerge(
          _state ? inputWrapperClasses[_state] : "",
          _wrapperProps?.className
        )}
      >
        <input
          {..._inputProps}
          className={twMerge(inputClasses?.common, _inputProps?.className)}
          type="text"
          value={_value}
          onChange={handleInputChange}
        />
        {_view === true &&
          (_timer && _timer > 0 ? (
            <div>
              <Countdown minutes={10} />
            </div>
          ) : (
            <div className="flex justify-between items-center w-[48px] h-[24px]">
              <View />
              <div className="rounded-xl w-[16px] h-[16px] border border-[1.3px] border-icon-2" />
            </div>
          ))}
      </div>
      {_bottomNode && (
        <p className="flex items-center font-[400] text-[12px] text-error">
          {_bottomNode}
        </p>
      )}
    </div>
  );
};
export default Input;
