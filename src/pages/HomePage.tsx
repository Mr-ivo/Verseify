import { BibleSelector } from '../components/BibleSelector';
import { BookSelector } from '../components/BookSelector';
import { ChapterSelector } from '../components/ChapterSelector';
import { useBible } from '../context/BibleContext';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export const HomePage = () => {
  const { selectedBible, selectedBook, error } = useBible();
  const topRef = useRef<HTMLDivElement>(null);

  // Improved function to handle scrolling to top
  function goToTop() {
    // Method 1: Using scrollIntoView with smooth behavior
    if (topRef.current) {
      topRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      return;
    }
    
    // Method 2: Fallback for browsers that don't support scrollIntoView with smooth behavior
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      // Method 3: Ultimate fallback for older browsers
      window.scrollTo(0, 0);
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Top anchor for back-to-top functionality */}
      <div id="top" ref={topRef}></div>
      
      {/* Hero Section */}
      <motion.section 
        className="bg-gradient-to-br from-emerald-800 to-emerald-900 text-white py-20 px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-emerald-400"></div>
          <div className="absolute top-20 right-20 w-60 h-60 rounded-full bg-emerald-400"></div>
          <div className="absolute bottom-10 left-1/4 w-40 h-40 rounded-full bg-emerald-500"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          >
            Explore Sacred Scripture <br />With Clarity & Insight
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Access multiple translations, navigate seamlessly through books and chapters, and discover the wisdom within.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <a 
              href="#select-version" 
              className="px-8 py-4 bg-white text-emerald-900 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all hover:bg-emerald-50 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              Begin Reading
            </a>
            
            <a 
              href="#how-it-works" 
              className="px-8 py-4 bg-transparent border-2 border-emerald-100 text-white rounded-lg font-medium text-lg hover:bg-emerald-800 transition-all flex items-center justify-center"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Main content */}
      <motion.section 
        className="flex-grow py-12 px-6 bg-slate-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto">
          {error && (
            <motion.div 
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-8 shadow-md" 
              role="alert"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">An error occurred</h3>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <div id="select-version" className="mb-16">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Your Bible Translation</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose from multiple translations to begin your scripture reading journey
              </p>
            </motion.div>
            
            <BibleSelector />
          </div>
          
          {selectedBible && (
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <BookSelector />
            </motion.div>
          )}
          
          {selectedBible && selectedBook && (
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ChapterSelector />
            </motion.div>
          )}

          <div id="how-it-works" className="mt-24 mb-16">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Designed for intuitive navigation and immersive scripture reading
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-emerald-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. Select Translation</h3>
                <p className="text-gray-600">
                  Choose from a variety of Bible translations in different languages to suit your reading preference.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-emerald-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. Choose Book & Chapter</h3>
                <p className="text-gray-600">
                  Navigate through the Old and New Testament books and select the specific chapter you want to read.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-emerald-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Search Scripture</h3>
                <p className="text-gray-600">
                  Use our powerful search functionality to find specific verses, themes, or topics throughout the Bible.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Super simple back to top button */}
      <a 
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          goToTop();
        }}
        className="cursor-pointer fixed bottom-8 right-8 p-3 rounded-full bg-emerald-700 text-white shadow-xl hover:bg-emerald-800 transition-all z-50 flex items-center justify-center"
        style={{ zIndex: 9999 }}
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </a>
    </div>
  );
};
