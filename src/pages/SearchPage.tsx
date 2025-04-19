import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { bibleApi } from '../services/bibleApi';
import { useBible } from '../context/BibleContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SearchResult {
  id: string;
  reference: string;
  text: string;
}

export const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedBible } = useBible();
const [localError, setLocalError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!selectedBible) return;
    
    try {
      setIsSearching(true);
      setSearchPerformed(true);
      setSearchQuery(query);
      setLocalError(null);

      
      const results = await bibleApi.search(selectedBible.id, query);
      setSearchResults(results.verses || []);
      
      if (results.verses && results.verses.length === 0) {
        setLocalError(`No results found for "${query}"`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setLocalError('Failed to search. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
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

  return (
    <motion.div 
      className="w-full min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div 
          className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-12 px-4 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.h1 
              className="text-4xl font-bold text-white mb-4"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
            >
              Search Scripture
            </motion.h1>
            <motion.p 
              className="text-lg text-emerald-100 max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Search for verses, passages, or topics in the Bible
            </motion.p>
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto w-full px-4 py-8">
          {!selectedBible && (
            <motion.div 
              className="bg-white border-l-4 border-emerald-500 p-4 mb-8 rounded-r-md shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-emerald-800">
                    You need to select a Bible version first. 
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block"
                    >
                      <Link to="/" className="font-medium underline text-emerald-700 hover:text-emerald-600 ml-1">
                        Go to selection page
                      </Link>
                    </motion.span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {localError && (
            <motion.div 
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r-md shadow-sm" 
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p>{localError}</p>
            </motion.div>
          )}

          <SearchBar onSearch={handleSearch} />

          <div className="mt-8">
            {isSearching ? (
              <motion.div 
                className="flex justify-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-16 h-16">
                  <motion.div 
                    className="w-16 h-16 border-4 border-emerald-200 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ) : searchPerformed && searchResults.length > 0 ? (
              <motion.div 
                className="bg-white shadow-lg overflow-hidden rounded-lg w-full"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <div className="p-4 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white">
                  <h2 className="text-xl font-medium">
                    {searchResults.length} results for "{searchQuery}"
                  </h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {searchResults.map((result) => (
                    <motion.li 
                      key={result.id} 
                      className="p-5 hover:bg-emerald-50 transition-colors duration-150"
                      variants={item}
                      whileHover={{ 
                        backgroundColor: "#ECFDF5", 
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="mb-2">
                        <h3 className="text-lg font-medium text-emerald-600">{result.reference}</h3>
                      </div>
                      <p className="text-gray-700">{result.text}</p>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : searchPerformed && searchResults.length === 0 && !localError ? (
              <motion.div 
                className="text-center py-12 bg-white rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <svg 
                  className="mx-auto h-16 w-16 text-emerald-400 mb-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <p className="text-gray-500 text-xl">No results found. Try a different search term.</p>
              </motion.div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
