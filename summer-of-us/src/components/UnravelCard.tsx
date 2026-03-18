import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { YarnBall, YarnTail } from './YarnAssets/YarnAssets';

interface Props {
  onComplete: () => void;
}

export const UnravelCard: React.FC<Props> = ({ onComplete }) => {
  const [isFinished, setIsFinished] = useState(false);
  
  // 1. Track vertical pull distance
  const y = useMotionValue(0);
  
  // 2. Map pull distance (0 to 150px) to visuals
  const ballOpacity = useTransform(y, [0, 150], [1, 0]);
  const ballScale = useTransform(y, [0, 150], [1, 0.5]);
  const cardScale = useTransform(y, [0, 100], [0.9, 1]);
  const cardOpacity = useTransform(y, [0, 80], [0, 1]);

  // 3. Polish: Haptic Feedback Listener
  // Triggers a tiny "click" vibration exactly when crossing the threshold
  useMotionValueEvent(y, "change", (latest) => {
    if (latest > 120 && latest < 125) {
      if ("vibrate" in navigator) {
        window.navigator.vibrate(20); 
      }
    }
  });

  const handleDragEnd = () => {
    // If she pulled past 120px, finish the interaction
    if (y.get() > 120) {
      setIsFinished(true);
      setTimeout(onComplete, 1200); // Slight delay for the celebration animation
    }
  };

  return (
    <div className="relative w-full max-w-md h-[500px] flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {!isFinished && (
          <>
            {/* THE REVEALED CARD (Underneath) */}
            <motion.div 
              style={{ scale: cardScale, opacity: cardOpacity }}
              className="absolute inset-0 bg-white rounded-3xl shadow-xl p-8 border-2 border-[#EADED2] flex flex-col justify-center text-center z-0"
            >
              <h2 className="text-3xl font-serif text-[#3C3C3C] mb-4">
                Happy Birthday, Love! 🧶
              </h2>
              <p className="text-stone-500 leading-relaxed mb-6">
                I built you something as unique as your crochet. 
                Ready for our Summer of Adventure?
              </p>
              <div className="text-4xl animate-bounce">✨</div>
            </motion.div>

            {/* THE YARN BALL COVER */}
            <motion.div 
              style={{ opacity: ballOpacity, scale: ballScale }}
              className="z-10 flex flex-col items-center pointer-events-none"
            >
              {/* Senior Polish: Shadow depth is handled inside YarnBall via Tailwind drop-shadow */}
              <YarnBall className="w-64 h-64 text-[#7A9482]" />
              
              {/* THE DRAGGABLE STRING */}
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 200 }}
                dragElastic={0.15} // Adds "weight" to the pull
                dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }} // Snappy return physics
                style={{ y }}
                onDragEnd={handleDragEnd}
                className="pointer-events-auto cursor-grab active:cursor-grabbing flex flex-col items-center"
              >
                <YarnTail className="w-12 h-32 text-[#7A9482]" />
                <motion.span 
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-[#7A9482] font-bold text-xs tracking-widest mt-2 uppercase select-none"
                >
                  Pull to Unravel
                </motion.span>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Celebration Transition */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center z-20 bg-white/80 backdrop-blur-md p-10 rounded-full shadow-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <p className="text-[#7A9482] font-bold text-xl uppercase tracking-tighter">
              Let the summer begin
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};