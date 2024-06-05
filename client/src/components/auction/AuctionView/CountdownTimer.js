import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = async () => {
      const now = new Date();
      const end = new Date(endTime);
      const difference = end - now;

      if (difference > 0) {
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((difference / 1000 / 60) % 60);
        let seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("Auksjon avsluttet ");

        clearInterval(interval);
      }
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial update

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex items-center text-xs text-gray-800">
      <Icon icon="lucide:timer" className="mr-1" /> {timeLeft}
    </div>
  );
};

export default CountdownTimer;
