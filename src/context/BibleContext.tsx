import { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Bible, Book, Chapter, bibleApi } from '../services/bibleApi';

interface BibleContextType {
  bibles: Bible[];
  selectedBible: Bible | null;
  setSelectedBible: (bible: Bible | null) => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  selectedChapter: Chapter | null;
  setSelectedChapter: (chapter: Chapter | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  fetchBibles: () => Promise<void>;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export const BibleProvider = ({ children }: { children: ReactNode }) => {
  const [bibles, setBibles] = useState<Bible[]>([]);
  const [selectedBible, setSelectedBible] = useState<Bible | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBibles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bibleApi.getBibles();
      setBibles(data);
    } catch (err: any) {
      console.error('Error fetching bibles:', err);
      // Check if the error might be related to authentication/API key
      
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError('API key invalid or missing. Please check your .env file and ensure you have a valid API key from https://scripture.api.bible/');
      } else {
        setError('Failed to load Bibles. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <BibleContext.Provider
      value={{
        bibles,
        selectedBible,
        setSelectedBible: (bible: Bible | null) => setSelectedBible(bible),
        selectedBook,
        setSelectedBook: (book: Book | null) => setSelectedBook(book),
        selectedChapter,
        setSelectedChapter: (chapter: Chapter | null) => setSelectedChapter(chapter),
        isLoading,
        setIsLoading,
        error,
        setError,
        fetchBibles,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};

export const useBible = () => {
  const context = useContext(BibleContext);
  if (context === undefined) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
};
