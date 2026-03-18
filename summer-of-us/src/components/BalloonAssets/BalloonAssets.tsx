import { motion } from "framer-motion";
import React from 'react';

/**
 * THE BALLOON
 * A modern, rounded SVG balloon with a realistic highlight and knot.
 */
export const Balloon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 200 250" 
    className={`${className} drop-shadow-2xl`} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="balloonGradient" cx="50%" cy="40%" r="50%" fx="30%" fy="30%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
      </radialGradient>
    </defs>
    
    <path 
      d="M100,20 C145,20 180,60 180,110 C180,160 145,210 100,210 C55,210 20,160 20,110 C20,60 55,20 100,20 Z" 
      fill="url(#balloonGradient)" 
    />
    
    <path d="M90,210 L110,210 L100,225 Z" fill="currentColor" />
    
    <ellipse 
      cx="70" cy="70" rx="15" ry="25" 
      fill="white" opacity="0.3" 
      transform="rotate(20 70 70)" 
    />
  </svg>
);

/**
 * PROPS INTERFACE
 */
interface PopAssetsProps {
  color?: string;
  count?: number;
}

/**
 * STAGE 1: THE POP BURST
 * The immediate circular "explosion" at the moment of impact.
 */
export const PopBurst: React.FC<PopAssetsProps> = ({ color = "#7A9482", count = 20 }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible z-50">
      {[...Array(count)].map((_, i) => {
        const angle = (i * 360) / count;
        const radius = 250;
        const xValue = Math.cos((angle * Math.PI) / 180) * radius;
        const yValue = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={`burst-${i}`}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{ 
              scale: [0, 1.5, 0], 
              x: xValue, 
              y: yValue 
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              delay: 0.02 
            }}
            style={{ backgroundColor: color }}
            className="absolute w-3 h-3 rounded-full"
          />
        );
      })}
    </div>
  );
};

/**
 * STAGE 2: THE CONFETTI RAIN
 * Full-screen cascade. Using 'fixed' ensures it spans the entire window.
 */
export const ConfettiRain: React.FC<PopAssetsProps> = ({ count = 100 }) => {
  const palette = ["#7A9482", "#D4AF37", "#F0EAD6", "#E1EAE1", "#C7D1C3"];

  const confettiPieces = [...Array(count)].map(() => ({
    color: palette[Math.floor(Math.random() * palette.length)],
    // Position across 100% of the viewport width
    left: Math.random() * 100, 
    xShift: Math.random() * 200 - 100, // Horizontal drift in pixels
    rotation: Math.random() * 1080 - 540,
    duration: Math.random() * 3 + 2, // 2s to 5s fall time
    delay: Math.random() * 2, // Staggered start
    scale: Math.random() * 0.4 + 0.6
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {confettiPieces.map((piece, i) => (
        <motion.div
          key={`rain-${i}`}
          initial={{ 
            opacity: 1, 
            y: "-10vh", 
            left: `${piece.left}vw`, // Randomized horizontal start
            rotate: 0, 
            scale: piece.scale 
          }}
          animate={{ 
            opacity: [1, 1, 0],
            y: "110vh", // Fall past the bottom of the screen
            x: piece.xShift, 
            rotate: piece.rotation 
          }}
          transition={{ 
            duration: piece.duration, 
            delay: piece.delay,
            ease: "linear"
          }}
          style={{ backgroundColor: piece.color }}
          className="absolute w-2.5 h-4 rounded-sm shadow-sm"
        />
      ))}
    </div>
  );
};