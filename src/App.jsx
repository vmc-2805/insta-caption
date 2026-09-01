import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowUp, FiEdit3, FiClock } from 'react-icons/fi';

import Header from './components/Header';
import CaptionForm from './components/CaptionForm';
import CaptionCard from './components/CaptionCard';
import HistoryList from './components/HistoryList';
import { generateCaptionsWithGemini } from './utils/geminiService';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Tab state ('generate' | 'history')
  const [activeTab, setActiveTab] = useState('generate');

  // Form states
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Casual');
  const [language, setLanguage] = useState('English');
  const [length, setLength] = useState('Medium');
  const [emojis, setEmojis] = useState(true);
  const [hashtags, setHashtags] = useState(true);
  const [count, setCount] = useState(3);

  // Image Upload preview state (Base64)
  const [imagePreview, setImagePreview] = useState(null);

  // App running states
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Refs for scrolling
  const formRef = useRef(null);
  const resultsRef = useRef(null);

  // Apply dark mode theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Load history from LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('instatool_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history from local storage:', e);
      }
    }
  }, []);

  // Save history to LocalStorage
  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem('instatool_history', JSON.stringify(newHistory));
  };

  // Show a temporary global toast message
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  // Image upload handling (instant base64 conversion)
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      triggerToast('Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded image preview
  const handleRemoveImage = () => {
    setImagePreview(null);
    triggerToast('Image removed');
  };

  // Form submit handler - Generates Captions
  const handleGenerate = () => {
    if (!topic.trim() && !imagePreview) {
      triggerToast('Please enter a topic description or upload an image.');
      return;
    }

    setLoading(true);
    
    const runGeneration = async () => {
      try {
        const generated = await generateCaptionsWithGemini({
          topic,
          tone,
          length,
          emojis,
          hashtags,
          count,
          image: imagePreview,
          language
        });

        setCaptions(generated);
        triggerToast('Captions generated!');

        // Prepend generated captions to local storage history (keep last 10)
        const newHistoryItems = generated.map((text) => ({
          id: `${Date.now()}-${Math.random()}`,
          text,
          timestamp: new Date().toISOString(),
          params: { topic, tone, length, emojis, hashtags, count, language }
        }));

        saveHistory([...newHistoryItems, ...history].slice(0, 10));

        // Scroll to results section
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } catch (err) {
        console.error(err);
        triggerToast(err.message || 'Generation failed');
      } finally {
        setLoading(false);
      }
    };

    runGeneration();
  };

  // Regenerate only a specific caption from the list
  const handleRegenerate = async (index) => {
    try {
      // Generate single real caption using Gemini API (with image & language if present)
      const generated = await generateCaptionsWithGemini({
        topic,
        tone,
        length,
        emojis,
        hashtags,
        count: 1,
        image: imagePreview,
        language
      });
      const singleGenerated = generated[0];

      // Update captions state
      setCaptions((prev) => {
        const updated = [...prev];
        updated[index] = singleGenerated;
        return updated;
      });

      // Prepend this regenerated caption to history list
      const newHistoryItem = {
        id: `${Date.now()}-${Math.random()}`,
        text: singleGenerated,
        timestamp: new Date().toISOString(),
        params: { topic, tone, length, emojis, hashtags, count, language }
      };

      saveHistory([newHistoryItem, ...history].slice(0, 10));
      triggerToast('Caption updated!');
    } catch (err) {
      console.error(err);
      triggerToast(err.message || 'Regeneration failed');
    }
  };

  // Reuse history details
  const handleReuse = (params) => {
    setTopic(params.topic);
    setTone(params.tone);
    setLength(params.length);
    setEmojis(params.emojis);
    setHashtags(params.hashtags);
    setCount(params.count);
    setLanguage(params.language || 'English');
    
    // Clear image when loading parameters from history
    setImagePreview(null);

    // Switch tab back to generate
    setActiveTab('generate');
    
    // Scroll to form smoothly
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    triggerToast('Settings loaded');
  };

  // Delete history item
  const handleDeleteHistory = (id) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    triggerToast('Deleted from history');
  };

  // Clear all history
  const handleClearHistory = () => {
    saveHistory([]);
    triggerToast('History cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-primary-800 dark:bg-primary-200 text-white dark:text-primary-950 py-2.5 px-4.5 rounded-xl shadow-md border border-primary-900 dark:border-primary-300 font-semibold text-xs uppercase tracking-wider text-center max-w-[90vw]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Layout Container */}
      <main className="max-w-[1440px] mx-auto w-full px-4 md:px-6 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & History Switcher */}
          <div ref={formRef} className="lg:col-span-5 w-full scroll-mt-6 space-y-4">
            
            {/* Control Panel Tab Switcher */}
            <div className="flex border border-gray-200 dark:border-gray-800 p-1 bg-white dark:bg-gray-900 rounded-xl shadow-xs">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'generate'
                    ? 'bg-primary-700 text-white dark:bg-primary-500 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-primary-700 dark:hover:text-primary-400'
                }`}
              >
                <FiEdit3 className="text-sm" />
                <span>Create Caption</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-primary-700 text-white dark:bg-primary-500 dark:text-white shadow-xs'
                    : 'text-gray-500 hover:text-primary-700 dark:hover:text-primary-400'
                }`}
              >
                <FiClock className="text-sm" />
                <span>Recent History</span>
                {history.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'history'
                      ? 'bg-primary-800 text-white dark:bg-primary-100 dark:text-primary-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-650 dark:text-gray-300'
                  }`}>
                    {history.length}
                  </span>
                )}
              </button>
            </div>

            {/* Content Display based on active tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'generate' ? (
                <motion.div
                  key="tab-generate"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <CaptionForm
                    topic={topic}
                    setTopic={setTopic}
                    tone={tone}
                    setTone={setTone}
                    language={language}
                    setLanguage={setLanguage}
                    length={length}
                    setLength={setLength}
                    emojis={emojis}
                    setEmojis={setEmojis}
                    hashtags={hashtags}
                    setHashtags={setHashtags}
                    count={count}
                    setCount={setCount}
                    onSubmit={handleGenerate}
                    loading={loading}
                    imagePreview={imagePreview}
                    onImageUpload={handleImageUpload}
                    onRemoveImage={handleRemoveImage}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="tab-history"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <HistoryList
                    history={history}
                    onReuse={handleReuse}
                    onDelete={handleDeleteHistory}
                    onClearAll={handleClearHistory}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Generation Results */}
          <div ref={resultsRef} className="lg:col-span-7 space-y-5 w-full scroll-mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Generated Captions
                  </h2>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-550 mt-0.5">
                    Ready to copy and post to your feed
                  </p>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                /* Loading State Spinner & Skeletons */
                <motion.div
                  key="loading-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 shadow-xs flex flex-col items-center justify-center py-14 gap-3">
                    <div className="w-10 h-10 border-2 border-gray-200 dark:border-gray-850 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
                    <div className="text-center">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-white">Generating captions...</h3>
                    </div>
                  </div>

                  {/* Skeletons */}
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="w-full bg-white/40 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800 rounded-xl p-5 space-y-2.5">
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-sm w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-sm w-1/2" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-md w-16 mt-3" />
                    </div>
                  ))}
                </motion.div>
              ) : captions.length > 0 ? (
                /* Results List */
                <motion.div
                  key="results-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {captions.map((cap, index) => (
                    <CaptionCard
                      key={`${index}-${cap.slice(0, 10)}`}
                      text={cap}
                      onRegenerate={handleRegenerate}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                /* Empty / Start State */
                <motion.div
                  key="empty-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 md:p-10 shadow-xs flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-4">
                    <img src="/Logoicon.png" alt="Insta Caption Generator Logo" className="w-full h-full object-contain opacity-50 dark:opacity-70 grayscale" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1.5">
                    Generate Captions
                  </h3>
                  <p className="max-w-md text-xs text-gray-400 dark:text-gray-500 font-semibold leading-relaxed">
                    Provide topic description or upload an image on the left to generate caption variations using Gemini.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-5 text-center border-t border-gray-200 dark:border-gray-800 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-550 mt-10">
        <p>© {new Date().getFullYear()} Insta Caption Generator.</p>
      </footer>
    </div>
  );
}
