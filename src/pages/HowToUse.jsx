import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit3, FiImage, FiSettings, FiCopy } from 'react-icons/fi';

export default function HowToUse() {
  const steps = [
    {
      icon: <FiImage className="text-4xl text-pink-500" />,
      title: "1. Upload an Image (Optional)",
      description: "Start by uploading the photo you want to post. Our AI will analyze the visual elements, colors, and mood to craft a highly context-aware caption."
    },
    {
      icon: <FiEdit3 className="text-4xl text-primary-500" />,
      title: "2. Describe Your Topic",
      description: "Enter a brief description of what the post is about. It could be a simple thought, a product description, or just a few keywords."
    },
    {
      icon: <FiSettings className="text-4xl text-blue-500" />,
      title: "3. Customize Settings",
      description: "Tweak the tone of voice, caption length, language, and toggle emojis or hashtags to match your personal brand perfectly."
    },
    {
      icon: <FiCopy className="text-4xl text-green-500" />,
      title: "4. Generate & Copy",
      description: "Hit generate and watch the magic happen! Review the options provided, click to copy your favorite, and paste it directly to Instagram."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            How to Use
          </h1>
          <p className="text-primary-100 text-lg max-w-xl mx-auto font-medium">
            Generating the perfect Instagram caption has never been easier. Follow these 4 simple steps to boost your engagement.
          </p>
        </div>

        {/* Steps Section */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3/4 bg-gray-200 dark:bg-gray-800" />
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-3/4 bg-gray-200 dark:bg-gray-800" />

            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center group relative bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              >
                <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-800 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
