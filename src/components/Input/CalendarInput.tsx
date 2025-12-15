import { forwardRef } from "react";
import Input from "@/components/Input/Input";
import Calendar from "@/svgs/Calendar.svg";

interface Props {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
}

const CalendarInput = forwardRef<HTMLDivElement, Props>(
  ({ value, onClick, placeholder }, ref) => {
    const displayValue =
      value && value.trim() !== "" ? value : placeholder ?? "";

    return (
      <div
        ref={ref}
        onClick={onClick}
        className="w-full"
      >
        <Input
          _state="textbox-basic"
          _value={displayValue}
          _containerProps={{
            className: "w-full",
          }}
          _inputProps={{
            readOnly: true,
            className: "w-full",
          }}
          _rightNode={<Calendar />}
        />
      </div>
    );
  }
);


CalendarInput.displayName = "CalendarInput";
export default CalendarInput;
