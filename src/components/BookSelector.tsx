import { useEffect, useState } from 'react';
import { bibleApi, Book } from '../services/bibleApi';
import { useBible } from '../context/BibleContext';
import { motion } from 'framer-motion';

export const BookSelector = () => {
  const [oldTestament, setOldTestament] = useState<Book[]>([]);
  const [newTestament, setNewTestament] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('old');
  const { selectedBible, setSelectedBook, setSelectedChapter, isLoading, setIsLoading, setError } = useBible();
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!selectedBible) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await bibleApi.getBooks(selectedBible.id);
        setAllBooks(data);

        const oldBooks = [];
        const newBooks = [];
        
        for (const book of data) {
          // Simple heuristic: if book ID is in the New Testament list or has a name that starts with common NT book names
          if (isNewTestamentBook(book)) {
            newBooks.push(book);
          } else {
            oldBooks.push(book);
          }
        }
        
        setOldTestament(oldBooks);
        setNewTestament(newBooks);
      } catch (err) {
        setError('Failed to load books. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [selectedBible, setIsLoading, setError]);

  // Helper function to determine if a book is in the New Testament
  const isNewTestamentBook = (book: Book) => {
    const ntBookIds = ['MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM', '1CO', '2CO', 
                      'GAL', 'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 
                      'TIT', 'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', 
                      '3JN', 'JUD', 'REV'];
    
    // Check if book ID is in the NT list
    if (ntBookIds.includes(book.id)) return true;
    
    // Alternative check if the book ID doesn't match but name might
    const ntBookPrefixes = ['Matt', 'Mark', 'Luke', 'John', 'Acts', 'Roma', 'Corin', 
                          'Galat', 'Ephes', 'Philip', 'Coloss', 'Thess', 'Timot', 
                          'Titus', 'Philem', 'Hebre', 'James', 'Peter', 'John', 'Jude', 'Revel'];
    
    for (const prefix of ntBookPrefixes) {
      if (book.name.startsWith(prefix)) return true;
    }
    
    return false;
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
  };

  if (!selectedBible) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Show all books if no books are found in the selected testament
  const booksToDisplay = activeTab === 'old' ? 
    (oldTestament.length > 0 ? oldTestament : allBooks) : 
    (newTestament.length > 0 ? newTestament : allBooks);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white">
          <h2 className="text-2xl font-bold">Select a Book</h2>
          <p className="text-emerald-100 mt-1">Choose from the Old or New Testament</p>
        </div>
        
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              className={`py-4 px-6 text-base font-medium border-b-2 ${
                activeTab === 'old'
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-all duration-200 focus:outline-none`}
              onClick={() => setActiveTab('old')}
              aria-current={activeTab === 'old' ? 'page' : undefined}
            >
              Old Testament
            </button>
            <button
              className={`py-4 px-6 text-base font-medium border-b-2 ${
                activeTab === 'new'
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-all duration-200 focus:outline-none`}
              onClick={() => setActiveTab('new')}
              aria-current={activeTab === 'new' ? 'page' : undefined}
            >
              New Testament
            </button>
          </div>
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
        ) : (
          <div className="p-6">
            {booksToDisplay.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 font-medium">No books found in this testament.</p>
                <p className="text-gray-500 mt-1">Please try the other tab.</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
                variants={container}
                initial="hidden"
                animate="show"
                key={activeTab} 
              >
                {booksToDisplay.map((book) => (
                  <motion.div
                    key={book.id}
                    variants={item}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBookSelect(book)}
                    className={`cursor-pointer rounded-lg px-3 py-4 text-center transition-all duration-200 ${
                      activeTab === 'old' 
                        ? 'bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-900'
                        : 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-900'
                    }`}
                  >
                    <div className="font-medium">{book.name}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
