
import { bibleApi, Chapter } from '../services/bibleApi';
import { useBible } from '../context/BibleContext';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function useChaptersQuery(bibleId?: string, bookId?: string) {
  return useQuery<Chapter[], Error>({
    queryKey: ['chapters', bibleId, bookId],
    queryFn: () => (bibleId && bookId) ? bibleApi.getChapters(bibleId, bookId) : Promise.resolve([]),
    enabled: !!bibleId && !!bookId,
    staleTime: 1000 * 60 * 60,
    retry: 2,
  });
}

export const ChapterSelector = () => {
  const { selectedBible, selectedBook, setSelectedChapter } = useBible();
  const { data: chapters = [], isLoading, error } = useChaptersQuery(selectedBible?.id, selectedBook?.id);

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
  };

  if (!selectedBible || !selectedBook) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-emerald-700 to-emerald-600 text-white">
          <h2 className="text-2xl font-bold">Select a Chapter</h2>
          <p className="text-emerald-100 mt-1">
            Book: <span className="font-medium">{selectedBook.name}</span>
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 right-0 bottom-0">
                <motion.div 
                  className="w-16 h-16 border-4 border-emerald-200 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </div>
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error.message || 'Failed to load chapters.'}</div>
        ) : (
          <div className="p-6">
            {chapters.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 font-medium">No chapters found for this book.</p>
              </div>
            ) : (
              <>
                <motion.div 
                  className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {chapters.map((chapter: Chapter) => (
                    <Link to="/reader" key={chapter.id}>
                      <motion.div
                        variants={item}
                        whileHover={{ 
                          scale: 1.1,
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChapterSelect(chapter)}
                        className="cursor-pointer bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-lg p-3 text-center transition-all duration-200 border border-emerald-200"
                      >
                        <span className="font-medium text-emerald-800">{chapter.number}</span>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>

                <div className="mt-6 text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    Select a chapter to start reading
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
