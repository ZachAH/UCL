import { auth } from '../firebase';
import { AdventureList } from './AdventureList';
import { AdventureMap } from './AdventureMap';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const user = auth.currentUser;

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto min-h-screen">
      
      {/* 1. THE HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-sage font-bold tracking-[0.2em] text-xs uppercase mb-2">
            <span className="w-8 h-[2px] bg-sage"></span>
            Established Summer 2026
          </div>
          <h1 className="text-5xl font-serif text-stone-800 tracking-tight">
            Our Summer of <span className="italic text-sage">Adventure</span>
          </h1>
          <p className="text-stone-500 font-medium mt-1">New Berlin, WI & Beyond</p>
        </motion.div>

        {/* User Profile / Logout */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 pr-6 rounded-full border border-stone-100 shadow-sm"
        >
          <img 
            src={user?.photoURL || ''} 
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm" 
            alt="Profile" 
          />
          <div className="text-right">
            <p className="text-sm font-bold text-stone-700 leading-none">{user?.displayName}</p>
            <button 
              onClick={() => auth.signOut()} 
              className="text-[10px] text-stone-400 hover:text-red-400 transition-colors uppercase tracking-widest font-bold mt-1"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </header>

      {/* 2. THE MAIN BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: THE MAP (Takes up 7/12 of the width) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/40 border border-stone-100 overflow-hidden min-h-[550px] relative group"
        >
          {/* Internal Map Heading */}
          <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-stone-100">
            {/* <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Adventure Map</p> */}
          </div>
          
          <AdventureMap />
        </motion.div>

        {/* RIGHT: THE BUCKET LIST (Takes up 5/12 of the width) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-5 h-[550px]"
        >
          <AdventureList />
        </motion.div>
      </div>

      {/* 3. FOOTER CARDS (Optional "Fun" Stats) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
      >
        <div className="bg-sage rounded-[2rem] p-6 text-white shadow-lg shadow-sage/20">
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">Next Adventure</p>
          <p className="text-xl font-serif italic">Lapham Peak Sunset Picnic</p>
        </div>
        <div className="bg-stone-800 rounded-[2rem] p-6 text-white shadow-lg shadow-stone-800/20">
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">Weather Forecast</p>
          <p className="text-xl font-serif">Perfect for Thrift Hauling 👗</p>
        </div>
        <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-1">Summer Mood</p>
          <p className="text-xl font-serif text-stone-700 italic">"Can't Wait" ✨</p>
        </div>
      </motion.div>

    </div>
  );
};