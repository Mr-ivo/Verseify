import { BookSelector } from '../components/BookSelector';
import { ChapterSelector } from '../components/ChapterSelector';
import { ScriptureContent } from '../components/ScriptureContent';
import { useBible } from '../context/BibleContext';
import { motion } from 'framer-motion';

export const ReaderPage = () => {
  const { selectedBible, selectedBook, selectedChapter, error } = useBible();

  if (!selectedBible) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="bg-white border-l-4 border-emerald-500 p-6 rounded-r-lg shadow-lg max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-base text-emerald-800 font-medium">
                Please select a Bible version on the home page first.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 shadow-md">
        <div className="w-full px-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 border-r border-emerald-500 md:max-h-[40vh] md:overflow-y-auto">
              <BookSelector />
            </div>
            <div className="w-full md:w-2/3 md:max-h-[40vh] md:overflow-y-auto">
              {selectedBook && <ChapterSelector />}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full flex-grow overflow-hidden">
        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4" 
            role="alert"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-medium">{error}</p>
          </motion.div>
        )}
        
        <div className="w-full h-full">
          {selectedBook && selectedChapter ? (
            <ScriptureContent />
          ) : (
            <motion.div 
              className="h-full flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg className="h-20 w-20 text-emerald-500 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-2xl font-bold text-emerald-900 mb-3">Ready to Begin Reading</h3>
              <p className="text-emerald-800 text-center max-w-md px-6">
                Select a book and chapter above to start your scripture reading journey.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
