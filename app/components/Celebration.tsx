"use client";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

export default function Celebration() {
  const [show, setShow] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  const handleCelebrate = () => {
    setShow(true);
    setTimeout(() => setShow(false), 3000); // stop after 3s
  };

  return (
    <div>
      <button
        className="p-2 px-4 bg-blue-600 text-white rounded-lg"
        onClick={handleCelebrate}
      >
        Drop Confetti 🎉
      </button>

      {show && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}
    </div>
  );
}
