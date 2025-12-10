import { forwardRef } from "react";
import Input from "@/components/Input/Input";
import Calendar from "@/svgs/Calendar.svg";

interface Props {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
}

const CalendarInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onClick, placeholder }, ref) => {
    const displayValue: string =
      value && value.trim() !== "" ? value : placeholder ?? "";

    return (
      <div onClick={onClick} ref={ref} style={{ width: "100%" }}>
        <Input
          _state="textbox-basic"
          _rightNode={<Calendar />}
          _value={displayValue}
          _inputProps={{
            readOnly: true,
          }}
        />
      </div>
    );
  }
);

CalendarInput.displayName = "CalendarInput";
export default CalendarInput;
