import { Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function Input({ input, setInput, sendMessage, isLoading }) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="p-4 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-sm border-t border-slate-700/50"
    >
      <div className="flex items-center space-x-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-100 placeholder-gray-400 transition-all duration-300 text-sm md:text-base"
            placeholder="Ask me anything about MOSDAC..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
            disabled={isLoading}
          />
          {/* Input glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 pointer-events-none focus-within:opacity-100"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 md:px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Send size={20} />
          )}
          <span className="hidden md:block font-medium">
            {isLoading ? "Sending..." : "Send"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Input;