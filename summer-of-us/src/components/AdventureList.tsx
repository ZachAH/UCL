import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// --- NEW SHARPIE STRIKETHROUGH COMPONENT ---
// This uses SVG dasharray to make the line "draw" itself.
const SharpieStrikethrough: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  return (
    <svg 
      viewBox="0 0 300 12" 
      preserveAspectRatio="none" 
      className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[10px] pointer-events-none z-10"
    >
      <motion.path
        d="M2,6 C30,4 280,7 298,6" // A slightly messy, hand-drawn marker path
        stroke="#1C1917" // A dark stone color (like a fresh black sharpie)
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }} // Start invisibly (all gap)
        animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }} // "Draw" the line
        transition={{ 
          duration: 0.5, // How long the "drawing" action takes
          ease: [0.12, 0, 0.39, 0], // Fast start, slow finish
          delay: isVisible ? 0.1 : 0 // Slight delay after checking the box
        }}
      />
    </svg>
  );
};

export const AdventureList = () => {
  const [items, setItems] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Grounding in the 'adventure_list' collection
    const q = query(collection(db, "adventure_list"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await addDoc(collection(db, "adventure_list"), {
      text: input,
      completed: false,
      createdAt: serverTimestamp(),
    });
    setInput('');
  };

  const toggleItem = async (id: string, completed: boolean) => {
    // Senior Polish: Trigger a tiny haptic haptic if on mobile
    if ("vibrate" in navigator) window.navigator.vibrate(12);
    
    await updateDoc(doc(db, "adventure_list", id), { completed: !completed });
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-stone-200/40 border border-stone-100 h-full flex flex-col max-h-[600px] selection:bg-[#7A9482]/20">
      
      {/* HEADER (With Progress Pill) */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <h3 className="text-2xl font-serif text-stone-800 tracking-tight">Summer Bucket List</h3>
        </div>
        <div className="text-[10px] font-bold text-sage bg-sage/10 px-3 py-1 rounded-full uppercase tracking-widest">
          {items.filter(i => i.completed).length} / {items.length} Completed
        </div>
      </div>
      
      {/* INPUT FIELD */}
      <form onSubmit={addItem} className="flex gap-2 mb-8 group">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New trail, date idea, or project..."
          className="flex-1 px-6 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:border-sage/20 focus:bg-white focus:ring-0 text-stone-700 transition-all placeholder:text-stone-300 font-medium"
        />
        <button 
          type="submit" 
          className="bg-sage hover:bg-[#687f6e] text-white px-6 rounded-2xl font-bold transition-all shadow-lg shadow-sage/20 active:scale-95"
        >
          Add
        </button>
      </form>

      {/* LIST AREA */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            // EMPTY STATE (Cute prompt)
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-stone-300 italic font-medium">No adventures yet. <br/> Let's plan something! 🌲</p>
            </motion.div>
          ) : (
            // THE ADVENTURES
            items.map((item) => (
              <motion.div 
                key={item.id}
                layout // Smooth sliding animation when list updates
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => toggleItem(item.id, item.completed)}
                className={`group flex items-center p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 relative ${
                  item.completed 
                    ? 'bg-stone-50 border-transparent opacity-80' 
                    : 'bg-white border-stone-50 hover:border-sage/20 hover:shadow-md shadow-sm'
                }`}
              >
                {/* CUSTOM CHECKBOX CIRCLE */}
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                  item.completed ? 'bg-sage border-sage scale-110' : 'border-stone-200 group-hover:border-sage/50'
                }`}>
                  {item.completed && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-[10px] font-bold">✓</motion.span>}
                </div>

                {/* THE ADVENTURE TEXT (Wrap it in relative div for positioning) */}
                <div className="flex-1 font-semibold tracking-tight transition-colors duration-500 relative">
                  <span className={`transition-colors duration-500 ${item.completed ? 'text-stone-400' : 'text-stone-700'}`}>
                    {item.text}
                  </span>
                  
                  {/* LAYER: THE BLACK SHARPIE (Only drawn when completed) */}
                  <SharpieStrikethrough isVisible={item.completed} />
                </div>

              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};