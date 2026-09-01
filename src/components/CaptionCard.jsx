import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiCheck, FiRefreshCw } from 'react-icons/fi';

export default function CaptionCard({ text, onRegenerate, index }) {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleRegenerateClick = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      onRegenerate(index);
      setIsRegenerating(false);
    }, 600);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="relative w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-xs hover:border-gray-400 dark:hover:border-gray-700 transition-all group overflow-hidden"
    >
      {/* Main Text Area */}
      <div className="relative min-h-[60px]">
        <AnimatePresence mode="wait">
          {isRegenerating ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center flex-col gap-1 bg-white/90 dark:bg-gray-900/90 z-10"
            >
              <FiRefreshCw className="text-xl text-gray-800 dark:text-gray-200 animate-spin" />
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Regenerating...</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="whitespace-pre-line text-gray-800 dark:text-gray-100 font-medium text-sm leading-relaxed break-words pb-3 select-all">
          {text}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80 pt-3 mt-1">
        {/* Character Count */}
        <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
          {text.length} characters
        </span>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Regenerate Button */}
          <button
            onClick={handleRegenerateClick}
            disabled={isRegenerating}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
            title="Regenerate this caption"
          >
            <FiRefreshCw className={`text-xs ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regen</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              copied
                ? 'bg-primary-700 border-primary-700 text-white dark:bg-primary-500 dark:border-primary-500 dark:text-white'
                : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            {copied ? (
              <>
                <FiCheck className="text-xs" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <FiCopy className="text-xs" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating success toast indicator (in-card) */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-3 right-3 bg-primary-800 dark:bg-primary-200 text-white dark:text-primary-950 px-2.5 py-1 rounded-md text-[10px] font-bold shadow-sm pointer-events-none"
          >
            Copied Successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
