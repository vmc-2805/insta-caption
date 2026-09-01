import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="w-full pt-2 pb-3 md:pt-2 md:pb-4 px-4 flex flex-col items-center justify-center text-center border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-6">
        {/* Top bar with Toggle & Logo */}
        <div className="flex justify-between items-center w-full mb-1">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center"
          >
            <div className="flex items-center justify-center rounded-lg bg-transparent">
              <img src="/Logo.png" alt="Insta Caption Generator Logo" className="h-16 md:h-20 max-w-[280px] md:max-w-xs object-contain" />
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleDarkMode}
              className="p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {darkMode ? (
                <FiSun className="text-lg text-amber-500" />
              ) : (
                <FiMoon className="text-lg text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="space-y-2 mt-2"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Insta Caption Generator
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Generate engaging Instagram captions in seconds. Enter your post details, choose your preferred style, and instantly receive multiple caption ideas.
          </p>
        </motion.div>
      </div>
    </header>
  );
}
