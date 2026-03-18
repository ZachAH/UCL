import { useState } from 'react'
import { UnravelCard } from './components/UnravelCard'
import { motion } from 'framer-motion'
// import { Dashboard } from './components/Dashboard' // We'll build this next!

function App() {
  const [showDashboard, setShowDashboard] = useState(false)

  return (
    <main className="min-h-screen bg-[#FDFBF7] selection:bg-[#7A9482]/30">
      {!showDashboard ? (
        /* The Birthday Reveal Experience */
        <div className="flex items-center justify-center min-h-screen">
          <UnravelCard onComplete={() => setShowDashboard(true)} />
        </div>
      ) : (
        /* The Actual Gift: Summer Hub */
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="p-4 md:p-8 max-w-6xl mx-auto"
        >
          {/* Placeholder for now so you can test the transition */}
          <header className="mb-8">
            <h1 className="text-4xl font-serif text-[#3C3C3C]">Our Summer of Adventure</h1>
            <p className="text-stone-500">New Berlin & Beyond • 2026</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 bg-white h-96 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-center">
                <p className="text-stone-400 font-medium italic">Adventure Map Loading...</p>
             </div>
             <div className="bg-white h-96 rounded-3xl shadow-sm border border-stone-100 flex items-center justify-center">
                <p className="text-stone-400 font-medium italic">Bucket List Loading...</p>
             </div>
          </div>
        </motion.div>
      )}
    </main>
  )
}

export default App