import { useState, useEffect } from "react";

const useCurrentHourLabel = () => {
  const [hourLabel, setHourLabel] = useState("");

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setHourLabel(`${hour}:00 기준`);
  }, []);

  return hourLabel;
};

export default useCurrentHourLabel;
