import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSmile, FiHash, FiSliders, FiFileText, FiZap, FiImage, FiX, FiGlobe, FiChevronDown } from 'react-icons/fi';

const tones = [
  'Casual',
  'Funny',
  'Professional',
  'Inspirational',
  'Romantic',
  'Luxury',
  'Motivational',
  'Minimal'
];

// Reusable Custom Popover Dropdown component
function CustomSelect({ label, value, options, onChange, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close the popover if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-405">
        {Icon && <Icon className="text-xs" />}
        {label}
      </label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950 text-gray-850 dark:text-gray-100 font-bold focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white text-left text-xs transition-all cursor-pointer relative"
      >
        <span className="truncate block pr-2">{activeOption.label}</span>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-550 flex items-center">
          <FiChevronDown className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Popover Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 z-40 mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
          >
            <div className="p-1.5 space-y-0.5">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg font-bold transition-all cursor-pointer block ${
                    value === opt.value
                      ? 'bg-primary-950 text-white dark:bg-primary-500 dark:text-white'
                      : 'text-gray-600 hover:text-primary-900 dark:text-gray-400 dark:hover:text-primary-100 hover:bg-primary-50 dark:hover:bg-primary-900/60'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CaptionForm({
  topic,
  setTopic,
  tone,
  setTone,
  language,
  setLanguage,
  length,
  setLength,
  emojis,
  setEmojis,
  hashtags,
  setHashtags,
  count,
  setCount,
  onSubmit,
  loading,
  imagePreview,
  onImageUpload,
  onRemoveImage
}) {
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() && !imagePreview) return;
    onSubmit();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const toneOptions = tones.map(t => ({ value: t, label: t }));
  const languageOptions = [
    { value: 'English', label: 'English (Standard)' },
    { value: 'Hinglish', label: 'Hindi (English Text)' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 md:p-6 shadow-xs"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Upload Post Image Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-550 dark:text-gray-400 block">
            Upload Post Image (Optional)
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
            className={`relative border border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
              imagePreview
                ? 'border-gray-300 bg-gray-50/20 dark:border-gray-700 dark:bg-gray-900/10'
                : 'border-gray-200 hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-700 bg-gray-50/10 hover:bg-gray-50/40 dark:bg-gray-950/10 dark:hover:bg-gray-950/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {imagePreview ? (
              <div className="flex items-center justify-between w-full gap-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Uploaded post"
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-800"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">Image Uploaded</p>
                    <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-550">Gemini will analyze this image directly</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="p-1.5 rounded-lg border border-gray-200 hover:border-red-200 dark:border-gray-800 dark:hover:border-red-900/30 hover:bg-red-50/50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-500 dark:text-gray-555 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <FiX className="text-sm" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-2 text-center">
                <FiImage className="text-lg text-gray-400 dark:text-gray-550 mb-1.5" />
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Drag & drop image or click to upload</p>
                <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-550 mt-0.5">Gemini will use this image to write the captions</p>
              </div>
            )}
          </div>
        </div>

        {/* Caption Topic / Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-550 dark:text-gray-400">
            <FiFileText />
            Caption Topic / Description {imagePreview ? '(Optional)' : ''}
          </label>
          <div className="relative">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={imagePreview ? "Describe specific details or leave blank to generate based on image only..." : "Example: Sunset at Goa beach with friends"}
              rows={4}
              maxLength={300}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-655 transition-all resize-none font-medium text-sm"
            />
            <div className="absolute bottom-3 right-3 text-xs font-medium text-gray-400 dark:text-gray-600">
              {topic.length}/300
            </div>
          </div>
        </div>

        {/* Settings Grid (Tone, Language, Variations Count) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Tone Custom Dropdown */}
          <CustomSelect
            label="Tone"
            value={tone}
            options={toneOptions}
            onChange={setTone}
            icon={FiSliders}
          />

          {/* Language Custom Dropdown */}
          <CustomSelect
            label="Language"
            value={language}
            options={languageOptions}
            onChange={setLanguage}
            icon={FiGlobe}
          />

          {/* Number of Variations */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-550 dark:text-gray-405">
              <FiZap className="text-xs" />
              Count
            </label>
            <div className="flex gap-1 p-1 bg-gray-50/50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                    count === num
                      ? 'bg-primary-700 text-white dark:bg-primary-500 dark:text-white shadow-sm'
                      : 'text-gray-555 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Caption Length Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-555 dark:text-gray-400 block">
            Caption Length
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50/50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
            {['Short', 'Medium', 'Long'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLength(l)}
                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  length === l
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                    : 'text-gray-555 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Switches (Emojis & Hashtags) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Emojis Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50/30 dark:bg-gray-955/30 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-655 dark:text-gray-400 rounded-lg">
                <FiSmile className="text-sm" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-850 dark:text-gray-200">Include Emojis</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-550">Add style emoticons</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEmojis(!emojis)}
              className={`w-10 h-6 relative rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${
                emojis ? 'bg-primary-700 dark:bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <div
                className={`bg-white dark:bg-gray-900 w-4 h-4 rounded-full shadow-sm absolute top-1 left-1 transform transition-transform duration-200 ${
                  emojis ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Hashtags Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50/30 dark:bg-gray-955/30 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-655 dark:text-gray-400 rounded-lg">
                <FiHash className="text-sm" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-850 dark:text-gray-200">Include Hashtags</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-550">Auto-append tags</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHashtags(!hashtags)}
              className={`w-10 h-6 relative rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${
                hashtags ? 'bg-primary-700 dark:bg-primary-500' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <div
                className={`bg-white dark:bg-gray-900 w-4 h-4 rounded-full shadow-sm absolute top-1 left-1 transform transition-transform duration-200 ${
                  hashtags ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={loading || (!topic.trim() && !imagePreview)}
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl bg-primary-700 hover:bg-primary-800 text-white dark:bg-primary-600 dark:text-white dark:hover:bg-primary-500 font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating captions...
            </>
          ) : (
            'Generate Captions'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
