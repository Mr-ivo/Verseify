import { useState } from 'react';
import { useBible } from '../context/BibleContext';
import { bibleApi } from '../services/bibleApi';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

function useChapterContentQuery(bibleId?: string, chapterId?: string) {
  return useQuery<{ content: string }, Error>({
    queryKey: ['chapterContent', bibleId, chapterId],
    queryFn: () => (bibleId && chapterId) ? bibleApi.getChapter(bibleId, chapterId) : Promise.resolve({ content: '' }),
    enabled: !!bibleId && !!chapterId,
    staleTime: 1000 * 60 * 60,
    retry: 2,
    select: (data: { content: string }) => ({ content: data.content }),
  });
}

export const ScriptureContent = () => {
  const { selectedBible, selectedBook, selectedChapter } = useBible();
  const [fontSize, setFontSize] = useState<number>(18);
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);

  const {
    data: chapterData,
    isLoading,
    error
  } = useChapterContentQuery(selectedBible?.id, selectedChapter?.id);

  const content = chapterData?.content || '';

  const increaseFontSize = () => {
    if (fontSize < 28) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 14) setFontSize(fontSize - 2);
  };

  const resetFontSize = () => {
    setFontSize(18);
  };

  const toggleControls = () => {
    setIsControlsVisible(!isControlsVisible);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white text-gray-900';
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      default:
        return 'bg-white text-gray-900';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="relative w-20 h-20">
          <motion.div 
            className="w-20 h-20 border-4 border-emerald-200 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Failed to Load Scripture</h3>
          <p className="text-gray-600">
            {error.message || 'Failed to load scripture content. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  if (!selectedBible || !selectedBook || !selectedChapter) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Begin Reading</h3>
          <p className="text-gray-600">
            Please select a Bible version, book, and chapter to start reading the scripture.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={`w-full h-screen flex flex-col ${getThemeClasses()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {isControlsVisible && (
          <motion.div 
            className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-4 shadow-lg w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {selectedBook.name} {selectedChapter.number}
                </h2>
                <div className="text-emerald-100 text-sm sm:text-base">
                  {selectedBible.name}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 mr-2">
                  <button onClick={decreaseFontSize} className="p-2 rounded-full hover:bg-emerald-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button onClick={resetFontSize} className="py-1 px-2 rounded-md hover:bg-emerald-600 text-xs transition-all">
                    {fontSize}px
                  </button>
                  <button onClick={increaseFontSize} className="p-2 rounded-full hover:bg-emerald-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 01-1 1h-3a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center space-x-1 border-l border-emerald-600 pl-3">
                  <button 
                    onClick={() => setTheme('light')} 
                    className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-emerald-600' : 'hover:bg-emerald-600'}`}
                    title="Light Mode"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setTheme('sepia')} 
                    className={`p-2 rounded-full transition-all ${theme === 'sepia' ? 'bg-emerald-600' : 'hover:bg-emerald-600'}`}
                    title="Sepia Mode"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setTheme('dark')} 
                    className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-emerald-600' : 'hover:bg-emerald-600'}`}
                    title="Dark Mode"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative flex-grow overflow-y-auto w-full">
        <button 
          onClick={toggleControls}
          className="absolute top-0 right-0 z-10 m-4 p-2 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all"
          title={isControlsVisible ? "Hide controls" : "Show controls"}
        >
          {isControlsVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div 
          className="w-full h-full px-4 py-6"
          style={{ fontSize: `${fontSize}px` }}
        >
          {content ? (
            <motion.div 
              className={`scripture-content ${theme === 'dark' ? 'dark-mode-content' : ''} w-full`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-center py-20 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg text-gray-500">Content could not be loaded. Please try another selection.</p>
            </div>
          )}
        </div>
      </div>

      <style>
        {
          `
            .scripture-content p {
              margin-bottom: 1em;
              line-height: 1.6;
            }
            .dark-mode-content p {
              color: rgba(255, 255, 255, 0.9);
            }
            .scripture-content h1, .scripture-content h2, .scripture-content h3 {
              margin: 1em 0 0.5em;
              font-weight: bold;
            }
            .scripture-content div {
              max-width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
            }
          `
        }
      </style>
    </motion.div>
  );
};
