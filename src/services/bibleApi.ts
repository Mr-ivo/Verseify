import axios from 'axios';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: 'https://api.scripture.api.bible/v1',
  headers: {
    'api-key': import.meta.env.VITE_BIBLE_API_KEY,
  },
});

export interface Bible {
  id: string;
  dblId: string;
  abbreviation: string;
  abbreviationLocal: string;
  name: string;
  nameLocal: string;
  description: string;
  descriptionLocal: string;
  language: {
    id: string;
    name: string;
    nameLocal: string;
    script: string;
    scriptDirection: string;
  };
}

export interface Book {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
}

export interface Chapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
}

export interface Verse {
  id: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
  next?: { id: string; bookId: string };
  previous?: { id: string; bookId: string };
}

export interface PassageContent {
  id: string;
  bibleId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
}

// API methods
export const bibleApi = {
  // Get available Bibles
  getBibles: async () => {
    try {
      const response = await api.get('/bibles');
      return response.data.data as Bible[];
    } catch (error) {
      console.error('Error fetching bibles:', error);
      throw error;
    }
  },

  // Get books for a specific Bible
  getBooks: async (bibleId: string) => {
    try {
      const response = await api.get(`/bibles/${bibleId}/books`);
      return response.data.data as Book[];
    } catch (error) {
      console.error(`Error fetching books for bible ${bibleId}:`, error);
      throw error;
    }
  },

  // Get chapters for a specific book
  getChapters: async (bibleId: string, bookId: string) => {
    try {
      const response = await api.get(`/bibles/${bibleId}/books/${bookId}/chapters`);
      return response.data.data as Chapter[];
    } catch (error) {
      console.error(`Error fetching chapters for book ${bookId}:`, error);
      throw error;
    }
  },

  // Get verses for a specific chapter
  getVerses: async (bibleId: string, chapterId: string) => {
    try {
      const response = await api.get(`/bibles/${bibleId}/chapters/${chapterId}/verses`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching verses for chapter ${chapterId}:`, error);
      throw error;
    }
  },

  // Get content for a specific verse
  getVerse: async (bibleId: string, verseId: string) => {
    try {
      const response = await api.get(`/bibles/${bibleId}/verses/${verseId}`, {
        params: { 'content-type': 'text' }
      });
      return response.data.data as Verse;
    } catch (error) {
      console.error(`Error fetching verse ${verseId}:`, error);
      throw error;
    }
  },

  // Get content for a specific chapter
  getChapter: async (bibleId: string, chapterId: string) => {
    try {
      const response = await api.get(`/bibles/${bibleId}/chapters/${chapterId}`, {
        params: { 'content-type': 'text' }
      });
      return response.data.data as PassageContent;
    } catch (error) {
      console.error(`Error fetching chapter ${chapterId}:`, error);
      throw error;
    }
  },

  // Search in a Bible
  search: async (bibleId: string, query: string) => {
    try {
      const response = await api.get(`/bibles/${bibleId}/search`, {
        params: { query }
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error searching for "${query}":`, error);
      throw error;
    }
  },
};
