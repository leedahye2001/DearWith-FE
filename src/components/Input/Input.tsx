"use client";

import { twMerge } from "tailwind-merge";

interface BasicInputProps {
  _containerProps?: React.ComponentProps<"div">;
  _wrapperProps?: React.ComponentProps<"div">;
  _inputProps?: React.ComponentProps<"input">;
  _state?: "textbox-basic" | "textbox-underline";
  _bottomNode?: React.ReactNode;
  _onChange?: (value: string) => void;
  _value?: string;
  _title?: string;
  _rightNode?: React.ReactNode;
}

const inputWrapperClasses = {
  "textbox-basic":
    "flex w-[327px] h-[44px] p-[10px] border border-divider-2 border-[1px] rounded-[4px] justify-between",
  "textbox-underline":
    "flex w-[327px] h-[44px] py-[10px] border-divider-2 border-b-[1px] justify-between",
};

const inputClasses = {
  common:
    "flex items-center justify-center text-[14px] font-[400] text-text-3 min-w-[200px] outline-none h-[20px]",
};

const Input = ({
  _containerProps,
  _wrapperProps,
  _inputProps,
  _state,
  _bottomNode,
  _onChange,
  _value,
  _title,
  _rightNode,
}: BasicInputProps & { _value: string }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (_onChange) {
      _onChange(value);
    }
  };

  return (
    <div
      {..._containerProps}
      className={twMerge("flex flex-col", _containerProps?.className)}
    >
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
          type={_inputProps?.type || "text"}
          value={_value}
          onChange={handleInputChange}
        />

        {_rightNode && <div>{_rightNode}</div>}
        {/* {_view === true &&
          (_timer && _timer > 0 ? (
            <div>
              <Countdown minutes={10} />
            </div>
          ) : (
            <div className="flex justify-between items-center w-[48px] h-[24px]">
              <ViewDefault />
              <div className="rounded-xl w-[16px] h-[16px] border border-[1.3px] border-icon-2" />
            </div>
          ))} */}
      </div>
      {_bottomNode && (
        <p className="flex items-center font-[400] text-[12px] text-error pt-[4px]">
          {_bottomNode}
        </p>
      )}
    </div>
  );
};
export default Input;
