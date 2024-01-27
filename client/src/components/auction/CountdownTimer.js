import React, { useState, useEffect } from "react";

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
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
        setTimeLeft("Auksjon avsluttet.");
        clearInterval(interval);
      }
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial update

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div>
      <b>Tid igjen:</b> {timeLeft}
    </div>
  );
};

export default CountdownTimer;
