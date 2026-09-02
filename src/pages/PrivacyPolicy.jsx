import React from 'react';
import { motion } from 'framer-motion';
import { FiShield } from 'react-icons/fi';

export default function PrivacyPolicy() {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 dark:border-gray-800"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
            <FiShield className="text-3xl text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Privacy Policy</h1>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          <section>
            <p className="text-lg">
              Welcome to Insta Caption Generator. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share information when you use our website.
            </p>
          </section>
          
          <section className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs">1</span>
              Information We Collect
            </h2>
            <p className="mb-3">We do not require you to create an account to use our service. However, we may collect:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-500 dark:text-gray-400">
              <li><strong className="text-gray-700 dark:text-gray-300">Usage Data:</strong> Information about how you interact with our website, including IP address, browser type, and device information.</li>
              <li><strong className="text-gray-700 dark:text-gray-300">User Input:</strong> The topics, settings, and images you upload are processed by our backend and third-party AI APIs to generate captions. We do not store images permanently.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs">2</span>
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide, operate, and maintain our services seamlessly.</li>
              <li>Improve, personalize, and expand our website features.</li>
              <li>Understand and analyze how you use our website to deliver better experiences.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs">3</span>
              Local Storage
            </h2>
            <p>
              We use your browser's local storage to save your caption generation history and theme preferences (dark/light mode). This data remains exclusively on your device and is not transmitted to our servers.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
