import { createContext, useState, useContext, ReactNode } from 'react';
import { Bible, Book, Chapter, bibleApi } from '../services/bibleApi';
import { useQuery } from '@tanstack/react-query';

function useBiblesQuery() {
  return useQuery<Bible[], Error>({
    queryKey: ['bibles'],
    queryFn: bibleApi.getBibles,
    staleTime: 1000 * 60 * 60, // 1 hour,
    retry: 2,
  });
}

interface BibleContextType {
  bibles: Bible[];
  selectedBible: Bible | null;
  setSelectedBible: (bible: Bible | null) => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  selectedChapter: Chapter | null;
  setSelectedChapter: (chapter: Chapter | null) => void;
  isLoading: boolean;
  error: string | null;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export const BibleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBible, setSelectedBible] = useState<Bible | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const { data: bibles = [], isLoading, error } = useBiblesQuery();

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
        error: error ? (error.message === 'Request failed with status code 401' || error.message === 'Request failed with status code 403'
          ? 'API key invalid or missing. Please check your .env file and ensure you have a valid API key from https://scripture.api.bible/'
          : 'Failed to load Bibles. Please try again later.') : null,
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
