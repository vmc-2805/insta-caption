import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';

export default function TermsOfService() {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100 dark:border-gray-800"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
            <FiFileText className="text-3xl text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Terms of Service</h1>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          <p className="text-lg">
            Please read these Terms of Service ("Terms") carefully before using the Insta Caption Generator website (the "Service").
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <section className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm">
                By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
              </p>
            </section>
            
            <section className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">2. Use of the Service</h2>
              <p className="text-sm">
                You agree not to use the Service for any unlawful purpose. You are solely responsible for the content you generate using our tool and how you publish it.
              </p>
            </section>
            
            <section className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">3. Intellectual Property</h2>
              <p className="text-sm">
                The service and its original content, features, and functionality are and will remain the exclusive property of Insta Caption Generator and its licensors.
              </p>
            </section>
            
            <section className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">4. AI Content</h2>
              <p className="text-sm">
                Captions are powered by AI. We do not guarantee accuracy or suitability. You are encouraged to review and edit captions before posting.
              </p>
            </section>
          </div>
          
          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. Continued use of the service implies acceptance of the updated terms.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
