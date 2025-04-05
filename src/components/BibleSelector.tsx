import { motion } from 'framer-motion';
import { useBible } from '../context/BibleContext';
import { Bible } from '../services/bibleApi';

export const BibleSelector = () => {
  const { bibles, selectedBible, setSelectedBible, setSelectedBook, setSelectedChapter, isLoading, error } = useBible();

  const handleBibleSelect = (bible: Bible) => {
    setSelectedBible(bible);
    setSelectedBook(null);
    setSelectedChapter(null);
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
      <div className="w-full rounded-lg bg-red-50 border border-red-200 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Unable to load Bible translations</h3>
            <div className="mt-2 text-red-700">
              {error.includes('API key') ? (
                <>
                  <p className="mb-2"><strong>API Key Error:</strong> Please check your Bible API key.</p>
                  <p>You need to get a key from <a href="https://scripture.api.bible" target="_blank" rel="noopener noreferrer" className="underline font-medium">scripture.api.bible</a> and add it to your .env file as VITE_BIBLE_API_KEY.</p>
                </>
              ) : error}
            </div>
          </div>
        </div>
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
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={container}
      >
        {bibles.map((bible) => (
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
