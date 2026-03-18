import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { motion } from "framer-motion";

export const Login = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 select-none">🌿</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 select-none">🧶</div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-stone-200/50 p-10 border border-stone-100 text-center relative z-10"
      >
        <div className="w-20 h-20 bg-[#7A9482]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🌲</span>
        </div>

        <h1 className="text-3xl font-serif text-stone-800 mb-2">Summer of Us</h1>
        <p className="text-stone-500 mb-8 leading-relaxed">
          A private collection of trails, yarn, and 2026 adventures.
        </p>

        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white border-2 border-stone-100 rounded-2xl font-bold text-stone-700 hover:border-[#7A9482]/30 hover:bg-stone-50 transition-all duration-300 group shadow-sm"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            className="w-6 h-6 group-hover:scale-110 transition-transform" 
            alt="Google logo"
          />
          Sign in with Google
        </button>

        <p className="mt-8 text-xs text-stone-400 uppercase tracking-widest font-semibold">
          Authorized Adventurers Only
        </p>
      </motion.div>
    </div>
  );
};