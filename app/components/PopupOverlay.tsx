"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PopupOverlay({ isOpen, onClose, children }: { isOpen: boolean, onClose: any, children: any }) {
  // Close popup with ESC key
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-20000"
            onClick={onClose}
          />

          {/* Popup Content */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-20001 flex items-center justify-center"
          >
            <div className="relative bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex items-center justify-center">
              {children}
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full p-2 transition"
              >
                ✕
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
