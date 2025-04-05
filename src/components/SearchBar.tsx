import { useState } from 'react';
import { useBible } from '../context/BibleContext';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const { selectedBible } = useBible();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the Bible..."
          className="block w-full rounded-lg border-2 border-emerald-300 bg-white px-4 py-4 pr-16 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none shadow-sm"
          disabled={!selectedBible}
          whileFocus={{ scale: 1.01, borderColor: "#10B981" }}
          transition={{ duration: 0.2 }}
        />
        <motion.button
          type="submit"
          disabled={!selectedBible || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md bg-emerald-600 p-3 text-white shadow-sm hover:bg-emerald-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </motion.button>
      </div>
      
      {!selectedBible && (
        <motion.p 
          className="mt-2 text-sm text-emerald-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Please select a Bible translation first
        </motion.p>
      )}
    </motion.form>
  );
};
