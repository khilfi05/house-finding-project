"use client";

import { useState, useRef, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import PopupOverlay from "./PopupOverlay";
import ReactConfetti from "react-confetti";

const EggIcon = L.icon({
  iconUrl: "/leaflet/dora.png", // 🥚
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

export default function EasterEggMarker() {
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  const timer = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  useEffect(() => {
    if (done) {
      localStorage.setItem("easter", "y")
    }
  })

  const handleCelebrate = () => {
    setShow(true);
  };

  const handleClick = (required: number, nextPhase: number) => {
    const now = Date.now();

    // If timer not started yet, initialize 1 second window
    if (!startTime.current) {
      startTime.current = now;
      timer.current = setTimeout(() => {
        // Time's up
        setCount(0);
        startTime.current = null;
        setMessage("⏳ Too slow! Try again.");
      }, 1500);
    }

    setCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= required) {
        // Success within 1 second window
        clearTimeout(timer.current!);
        startTime.current = null;
        setCount(0);

        if (nextPhase === 1) {
          setPhase(1);
          setMessage("Click the button 6 times in one second");
        } else if (nextPhase === 2) {
          setPhase(2);
          setMessage("✅ Phase 1 complete! Second button unlocked!");
        } else if (nextPhase === 3) {
          setPhase(3);
          setMessage("🎉 You did it! You got a mysterious prize from Dora.");
          handleCelebrate()
          const playSound = () => {
            const sound = new Audio('/easter-egg/dora_success_tone.mp3');
            sound.play();
          };
          playSound()
        } else if (nextPhase === 4) {
          setPhase(4)
          setMessage("🎉 Thanks for the help!");
          setIsOpen(true)
          setShow(false)
          setDone(true)
        }
      } else {
        setMessage(`Clicks: ${newCount}/${required} (within 1 second)`);
      }
      return newCount;
    });
  };



  return (
    <>
    <PopupOverlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {/* Popup content — anything you want */}
      <img
        src="/tng/money-packet.png"
        alt="Money Packet"
        className="rounded-xl shadow-lg max-h-[80vh] object-contain"
      />
    </PopupOverlay>
    <Marker position={[19.433779218509624, -99.12035522247317]} icon={EggIcon}>
      <Popup>
        
        <div className="popup-content">

          <img
            src="/easter-egg/dora-monkey-swiper.png"
            alt="Dora and Monkey"
            className="w-full h-32 object-cover rounded-md mb-2"
          />

          {/* Title */}
          <div className="popup-title font-semibold text-base mb-1 text-purple-800">
            [SECRET] Mission: Dora Impossible
          </div>

          <div className="text-xs text-gray-700 mb-2">
            <label className="text-purple-400">Dora</label> and <label className="text-blue-400">Boots</label> were looking for an ancient treasure in Mexico City when the cheeky <label className="text-blue-700">Swiper</label> got there first and locked the chest tight!
          </div>

          <div>
              <strong>Mission:</strong>{" "}
              Open the chest
          </div>

          <div>
              <strong>Reward:</strong>{" "}
              <i>"Only those who seek shall find"</i> - John D.
          </div>

          <div className="mb-4" />

          <div className="text-sm text-gray-700 mb-2">{message}</div>

          {phase === 0 && (
            <button
              type="button"
              onClick={() => handleClick(0, 1)}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Start Mission
            </button>
          )}

          {phase === 1 && (
            <button
              onClick={() => handleClick(6,2)}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              {count}
            </button>
          )}

          {phase === 2 && (
            <button
              onClick={() => handleClick(7,3)}
              className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Button 2
            </button>
          )}

          {show && (
            <ReactConfetti width={windowSize.width} height={windowSize.height} />
          )}

          {phase === 3 && (
            <button
            onClick={() => {setShow(false); setIsOpen(true); setMessage("🎉 Thanks for the help!")}}
            className="px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Claim Reward
            </button>
          )}

        </div>
      </Popup>
    </Marker>
  </>);
}
