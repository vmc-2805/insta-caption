import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiRefreshCw, FiCalendar } from 'react-icons/fi';

export default function HistoryList({ history, onReuse, onDelete, onClearAll }) {
  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent History</h2>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">
            Last 10 generated captions
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer bg-red-50/50 dark:bg-red-950/20 px-2.5 py-1.5 rounded-lg border border-red-100/50 dark:border-red-900/20"
          >
            Clear History
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl"
            >
              <div className="text-2xl mb-2">🕒</div>
              <p className="text-xs font-semibold text-gray-550 dark:text-gray-400">
                No recent history yet
              </p>
            </motion.div>
          ) : (
            history.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col justify-between gap-3 p-4 bg-gray-50/20 dark:bg-gray-950/30 hover:bg-gray-50/60 dark:hover:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl transition-all"
              >
                {/* Meta details */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiCalendar />
                    {formatDate(item.timestamp)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold">
                    {item.params.tone} · {item.params.length}
                  </span>
                </div>

                {/* Caption text */}
                <p className="whitespace-pre-line text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed break-words">
                  {item.text}
                </p>

                {/* Footer and action buttons */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-gray-800/60">
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                    {item.text.length} chars
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Reuse Button */}
                    <button
                      onClick={() => onReuse(item.params)}
                      className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-[10px] font-bold text-gray-650 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-gray-950 hover:border-gray-300 dark:hover:border-gray-700 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <FiRefreshCw className="text-[9px]" />
                      <span>Reuse settings</span>
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-450 hover:text-red-500 hover:border-red-200 dark:text-gray-500 dark:hover:text-red-400 dark:hover:border-red-900/30 bg-white dark:bg-gray-950 transition-all cursor-pointer"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
