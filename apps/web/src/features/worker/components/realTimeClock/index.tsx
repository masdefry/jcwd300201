"use client";

import { useState, useEffect } from "react";

export default function RealTimeClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const currentTime = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTime(currentTime);
    };

    updateClock(); // Panggil sekali saat komponen mount
    const interval = setInterval(updateClock, 1000); // Update setiap detik

    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  return (
    <div className="text-center text-base">
      <p>Jam Sekarang:</p>
      <p className="font-bold">{time}</p>
    </div>
  );
}
