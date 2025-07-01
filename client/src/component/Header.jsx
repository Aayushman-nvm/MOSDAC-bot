import { Menu } from "lucide-react";
import { motion } from "framer-motion";

function Header({ setSidebarOpen, sidebarOpen }) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 shadow-lg"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={20} />
      </motion.button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-sm md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold tracking-wide">
          MOSDAC Virtual Assistant
        </h2>
        <p className="text-xs text-gray-400 mt-1">BAH 2025</p>
      </motion.div>

      <div className="w-12" />
    </motion.div>
  );
}

export default Header;