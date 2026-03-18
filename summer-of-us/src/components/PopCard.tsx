import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Balloon, PopBurst, ConfettiRain } from './BalloonAssets/BalloonAssets';

// Assets
import papa from '../assets/papa.jpg';
import rachel1 from '../assets/rachel1.jpg';
import rachel2 from '../assets/rachel2.jpg';
import sunny from '../assets/sunny.jpg';

interface Props {
  onComplete: () => void;
}

export const PopCard: React.FC<Props> = ({ onComplete }) => {
  const [isPopped, setIsPopped] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const y = useMotionValue(0);

  // The Photo Array for Shuffling
  const photos = [
    { src: rachel1, rotate: 5, label: "Rachel" },
    { src: papa, rotate: -8, label: "Family" },
    { src: rachel2, rotate: -5, label: "Rachel 2" },
    { src: sunny, rotate: 10, label: "Sunny" },
  ];

  // Logic: Shuffle every 2.5 seconds after the balloon is popped
  useEffect(() => {
    if (isPopped) {
      const interval = setInterval(() => {
        setPhotoIndex((prev) => (prev + 1) % photos.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isPopped, photos.length]);

  // Interaction Physics
  const balloonScaleY = useTransform(y, [0, 150], [1, 1.25]);
  const balloonScaleX = useTransform(y, [0, 150], [1, 0.82]);
  const stringOpacity = useTransform(y, [145, 150], [1, 0]);

  const handleDragEnd = () => {
    if (y.get() > 140) {
      setIsPopped(true);
      if ("vibrate" in navigator) window.navigator.vibrate([20, 50, 20]);
    }
  };

  return (
    <div className="relative w-full max-w-lg h-[750px] flex items-center justify-center overflow-visible">
      <AnimatePresence mode="wait">
        {!isPopped ? (
          /* --- STAGE 1: THE BALLOON --- */
          <motion.div
            key="balloon-interactive"
            exit={{
              scale: 3,
              opacity: 0,
              transition: { duration: 0.12, ease: "easeOut" }
            }}
            className="flex flex-col items-center z-20"
          >
            <motion.div style={{ scaleY: balloonScaleY, scaleX: balloonScaleX }}>
              <Balloon className="w-64 h-80 text-sage drop-shadow-2xl" />
            </motion.div>

            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 220 }}
              dragElastic={0.01}
              style={{ y, opacity: stringOpacity }}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing flex flex-col items-center mt-[-45px] z-30"
            >
              <div className="w-[1.5px] h-48 bg-stone-300 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-sage rounded-full border-2 border-white shadow-lg" />
              </div>

              <motion.p
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-sage font-bold text-[10px] tracking-[0.4em] mt-6 uppercase select-none bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full border border-stone-100"
              >
                Pull to Pop
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          /* --- STAGE 2: THE CELEBRATION & LETTER --- */
          <motion.div
            key="reveal-letter"
            className="relative flex flex-col items-center justify-center w-full h-full"
          >
            <PopBurst color="#7A9482" count={25} />
            <ConfettiRain count={120} />

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 120, delay: 0.2 }}
              className="bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] p-10 md:p-14 text-center border border-stone-100 max-w-sm md:max-w-md relative z-10 mx-6"
            >
              <div className="text-5xl mb-8">🎈</div>

              {/* SHUFFLING PHOTO STACK */}
              <div className="relative w-full h-56 mb-10 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={photoIndex}
                    initial={{ opacity: 0, x: 50, rotate: 15, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, rotate: photos[photoIndex].rotate, scale: 1 }}
                    exit={{ opacity: 0, x: -50, rotate: -15, scale: 0.9 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="absolute"
                  >
                    <img
                      src={photos[photoIndex].src}
                      alt={photos[photoIndex].label}
                      className="w-44 h-44 object-cover rounded-2xl border-4 border-white shadow-2xl"
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Background "Ghost" Cards for depth */}
                <div className="absolute w-44 h-44 rounded-2xl border-4 border-white bg-stone-50 shadow-sm -rotate-6 -z-10 translate-x-2" />
                <div className="absolute w-44 h-44 rounded-2xl border-4 border-white bg-stone-100 shadow-sm rotate-3 -z-20 -translate-x-2" />
              </div>

              <h2 className="text-4xl font-serif text-stone-800 mb-6 tracking-tight leading-tight">
                Happy Birthday, <br />
                <span className="italic text-sage font-medium text-5xl italic">Babe!</span>
              </h2>

              <div className="space-y-4 text-stone-600 font-medium leading-relaxed text-lg mb-10">
                <p>
                  I wanted to build you something as unique as the pieces you make with your crocheting. I love you so much! I know you have been planning our summer with awesome things to do! So i wanted to make you a website to keep track of all of them!!!
                </p>
                <p>
                  Inside this hub, you'll find all the ways to record our....
                  <span className="text-sage font-bold"> Summer of 2026.</span>
                </p>
              </div>

              <button
                onClick={onComplete}
                className="w-full py-5 bg-sage hover:bg-[#687f6e] text-white rounded-[1.5rem] font-bold shadow-xl shadow-sage/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Open Adventure Map
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};