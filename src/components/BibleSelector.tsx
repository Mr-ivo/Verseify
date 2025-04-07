import { motion } from 'framer-motion';
import { useBible } from '../context/BibleContext';
import { Bible } from '../services/bibleApi';
import { useState } from 'react';

export const BibleSelector = () => {
  const { bibles, selectedBible, setSelectedBible, setSelectedBook, setSelectedChapter, isLoading, error } = useBible();
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 8;
  const totalPages = Math.ceil(bibles.length / itemsPerPage);
  
  // Calculate which Bibles to display based on current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleBibles = bibles.slice(startIndex, endIndex);

  const handleBibleSelect = (bible: Bible) => {
    setSelectedBible(bible);
    setSelectedBook(null);
    setSelectedChapter(null);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (error && !bibles.length) {
    return (
      <div className="w-full rounded-lg bg-red-50 border border-red-200 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <motion.div 
              className="w-20 h-20 border-4 border-emerald-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-emerald-800 font-medium">Loading Bible translations...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full"
      initial="hidden"
      animate="show"
      variants={container}
    >      
      <div className="flex flex-col space-y-4">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          key={`page-${currentPage}`} // Re-animate when page changes
        >
          {visibleBibles.map((bible) => (
            <motion.div
              key={bible.id}
              variants={item}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => handleBibleSelect(bible)}
                className={`w-full h-full flex flex-col items-center justify-center p-6 border rounded-xl transition-all duration-300 shadow-sm ${
                  selectedBible?.id === bible.id 
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500 ring-opacity-50' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100 mb-3">
                  <span className="font-bold text-lg text-emerald-700">{bible.abbreviation}</span>
                </div>
                <span className="font-medium text-gray-900 text-center mb-1">{bible.name}</span>
                <div className="mt-2 px-3 py-1 bg-gray-100 rounded-full">
                  <span className="text-xs text-gray-600">{bible.language.name}</span>
                </div>
                
                {selectedBible?.id === bible.id && (
                  <motion.div 
                    className="mt-3 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    Selected
                  </motion.div>
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </button>
            
            <div className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {bibles.length === 0 && !isLoading && !error && (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xl text-gray-600">No Bible translations found</p>
        </div>
      )}
    </motion.div>
  );
};
