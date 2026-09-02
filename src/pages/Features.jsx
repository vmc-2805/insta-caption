import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiImage, FiGlobe, FiSmile, FiTrendingUp, FiCpu } from 'react-icons/fi';

export default function Features() {
  const features = [
    {
      icon: <FiCpu className="text-3xl text-primary-500" />,
      title: "AI-Powered Generation",
      description: "Powered by advanced Gemini AI to understand context and deliver highly relevant and engaging captions for any topic."
    },
    {
      icon: <FiImage className="text-3xl text-pink-500" />,
      title: "Image Analysis",
      description: "Upload your photo and our AI will automatically describe the scene, colors, and mood to create the perfect matching caption."
    },
    {
      icon: <FiSmile className="text-3xl text-yellow-500" />,
      title: "Tone Customization",
      description: "From professional and polite to funny, sarcastic, and casual—set the exact vibe you want for your audience."
    },
    {
      icon: <FiGlobe className="text-3xl text-green-500" />,
      title: "Multilingual Support",
      description: "Generate captions in multiple languages including English, Hinglish, Spanish, French, and more to reach a global audience."
    },
    {
      icon: <FiTrendingUp className="text-3xl text-blue-500" />,
      title: "Trending Hashtags",
      description: "Automatically append the most relevant and trending hashtags to maximize your post's reach and engagement."
    },
    {
      icon: <FiZap className="text-3xl text-purple-500" />,
      title: "Instant Results",
      description: "No more writer's block. Get multiple caption variations in seconds, ready to be copied and pasted directly to Instagram."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400 mb-4 tracking-tight">
          Supercharge Your Social Media
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
          Discover all the powerful features that make Insta Caption Generator the ultimate tool for creators, influencers, and brands.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border border-gray-100 dark:border-gray-800 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex flex-col items-start gap-4 transition-all"
          >
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
