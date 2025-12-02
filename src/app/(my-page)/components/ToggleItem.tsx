"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface ToggleItemProps {
  label: string;
  defaultState: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleItem({
  label,
  defaultState,
  onChange,
}: ToggleItemProps) {
  const [isOn, setIsOn] = useState(defaultState);

  const toggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    onChange(newValue);
  };

  return (
    <div
      className="flex justify-between items-center py-[14px] cursor-pointer"
      onClick={toggle}
    >
      <p className="text-[14px] text-text-5 font-[400]">{label}</p>

      <div
        className={`w-[44px] h-[24px] flex items-center px-[2px] rounded-full transition-all duration-300
          ${isOn ? "bg-primary" : "bg-gray-300"}`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-[20px] h-[20px] bg-white rounded-full shadow-md"
          style={{
            marginLeft: isOn ? "calc(100% - 20px)" : "0px",
          }}
        />
      </div>
    </div>
  );
}
