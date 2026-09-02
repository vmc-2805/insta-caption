import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Features from './pages/Features';
import HowToUse from './pages/HowToUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

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

  return (
    <Router>
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
        
        {/* Header */}
        <Header
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Main Layout Container */}
        <main className="max-w-[1440px] mx-auto w-full px-4 md:px-6 py-6 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center border-t border-gray-200 dark:border-gray-800 mt-10">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-500 dark:text-gray-400">
              <Link to="/features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</Link>
              <Link to="/how-to-use" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How to Use</Link>
              <Link to="/privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</Link>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-550 mt-2">
              © {new Date().getFullYear()} Insta Caption Generator.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
