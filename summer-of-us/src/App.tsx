import { useState } from 'react'
import './index.css'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase'
import { Login } from './components/Login'
import { PopCard } from './components/PopCard' // Updated import name
import { Dashboard } from './components/Dashboard'

// 1. LOCK DOWN ACCESS
const ALLOWED_EMAILS = ["etta1055@gmail.com", "merkt.rachel@gmail.com"];

function App() {
  const [user, loading] = useAuthState(auth);
  const [showDashboard, setShowDashboard] = useState(false);

  // 2. LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        {/* Updated loading text to match the balloon/party theme */}
        <div className="animate-pulse text-[#7A9482] font-serif text-xl italic">
          🎈 Filling up the balloons...
        </div>
      </div>
    );
  }

  // 3. AUTHENTICATION GATE
  if (!user) {
    return <Login />;
  }

  // 4. SECURITY CHECK (Whitelist)
  if (user.email && !ALLOWED_EMAILS.includes(user.email)) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-serif text-stone-800 mb-4">Sorry, this adventure is private! 🌲</h1>
        <p className="text-stone-500 mb-6 text-sm">You are logged in as {user.email}</p>
        <button 
          onClick={() => auth.signOut()} 
          className="px-6 py-3 bg-stone-100 hover:bg-stone-200 rounded-2xl text-stone-700 font-bold transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // 5. MAIN CONTENT (Authorized)
  return (
    <main className="min-h-screen bg-[#FDFBF7] selection:bg-[#7A9482]/30 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!showDashboard ? (
          /* STATE 1: THE BALLOON POP REVEAL */
          <motion.div 
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }} // Expands slightly as it fades out for the pop feel
            className="flex items-center justify-center min-h-screen p-4"
          >
            <PopCard onComplete={() => setShowDashboard(true)} />
          </motion.div>
        ) : (
          /* STATE 2: THE SUMMER HUB DASHBOARD */
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
          >
            {/* Senior Tip: Moving the Dashboard logic to its own component 
                keeps App.tsx clean and manageable. 
            */}
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App