import { useRef, useEffect, useState } from "react";
import { Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TypingAnimation from "./TypingAnimation";
import LoadingDots from "./LoadingDots";

function ChatArea({ messages, isLoading }) {
  const bottomRef = useRef(null);
  const [typingStates, setTypingStates] = useState({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleTypingComplete = (messageIndex) => {
    setTypingStates(prev => ({ ...prev, [messageIndex]: true }));
  };

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-40 h-40 bg-indigo-500/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <AnimatePresence>
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: idx * 0.1
            }}
            className={`flex items-start space-x-3 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                  : "bg-gradient-to-r from-purple-500 to-indigo-600"
                }`}
            >
              {msg.role === "user" ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </motion.div>

            {/* Message Bubble */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl backdrop-blur-sm border text-sm md:text-base relative overflow-hidden ${msg.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500/30 shadow-lg shadow-blue-500/25"
                  : "bg-gradient-to-r from-slate-800/90 to-slate-700/90 text-gray-100 border-slate-600/30 shadow-lg shadow-slate-900/50"
                }`}
            >
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full animate-pulse"></div>

              <div className="relative z-10 whitespace-pre-wrap">
                {msg.role === "bot" && !typingStates[idx] ? (
                  <TypingAnimation
                    text={msg.content || ""}
                    onComplete={() => handleTypingComplete(idx)}
                  />
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: (msg?.content || "")
                        .replace(/\n/g, "<br>")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start space-x-3"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 px-4 py-3 rounded-2xl backdrop-blur-sm border border-slate-600/30 shadow-lg">
            <LoadingDots />
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatArea;