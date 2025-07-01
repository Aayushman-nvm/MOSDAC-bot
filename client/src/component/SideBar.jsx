import { X, Github, Linkedin, Globe, Twitter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SideBar({ sidebarOpen, setSidebarOpen }) {
  const socialLinks = [
    { href: "https://github.com/Aayushman-nvm", icon: Github, label: "GitHub" },
    { href: "https://www.linkedin.com/in/aayushman-jha-b45a91287", icon: Linkedin, label: "LinkedIn" },
    { href: "https://x.com/White_nvm", icon: Twitter, label: "Twitter" },
    { href: "https://aayushman-dev.vercel.app/", icon: Globe, label: "Website" }
  ];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-6 z-50 shadow-2xl border-r border-slate-700/50"
      >
        {/* Close Button */}
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl hover:bg-slate-700/50 transition-colors duration-300"
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center space-y-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
              <img
                src="profile.jpg"
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-slate-700"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/112/4F46E5/FFFFFF?text=AJ";
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </motion.div>

          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Aayushman Jha
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm mt-1"
            >
              Full Stack Developer
            </motion.p>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-4">Connect</h3>
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group"
            >
              <link.icon size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
              <span className="font-medium group-hover:text-white transition-colors">{link.label}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-6 left-6 right-6 text-center"
        >
          <p className="text-xs text-gray-500">
            Built with ❤️ for BAH 2025
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}

export default SideBar;