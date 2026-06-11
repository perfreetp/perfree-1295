import { create } from 'zustand';
import { collections, type Collection, type Category, type Dynasty } from '../data/collections';
import { exhibitions } from '../data/exhibitions';
import type { Exhibition } from '../data/exhibitions';

export interface Comment {
  id: string;
  collectionId: string;
  userId: string;
  username: string;
  content: string;
  date: string;
  rating: number;
}

interface CollectionStore {
  items: Collection[];
  exhibitions: Exhibition[];
  searchKeyword: string;
  selectedCategory: Category | null;
  selectedDynasty: Dynasty | null;
  currentItem: Collection | null;
  comments: Comment[];

  setSearchKeyword: (keyword: string) => void;
  setCategory: (category: Category | null) => void;
  setDynasty: (dynasty: Dynasty | null) => void;
  setCurrentItem: (item: Collection | null) => void;
  addComment: (collectionId: string, userId: string, username: string, content: string, rating: number) => void;
  incrementViewCount: (collectionId: string) => void;
}

const STORAGE_KEY = 'museum_collection_store';

const loadFromStorage = (): Partial<CollectionStore> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        searchKeyword: parsed.searchKeyword,
        selectedCategory: parsed.selectedCategory,
        selectedDynasty: parsed.selectedDynasty,
        comments: parsed.comments,
        items: parsed.items,
      };
    }
  } catch (e) {
    console.error('Failed to load collection store from localStorage', e);
  }
  return {};
};

const saveToStorage = (state: CollectionStore) => {
  try {
    const toSave = {
      searchKeyword: state.searchKeyword,
      selectedCategory: state.selectedCategory,
      selectedDynasty: state.selectedDynasty,
      comments: state.comments,
      items: state.items,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save collection store to localStorage', e);
  }
};

const persisted = loadFromStorage();

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  items: persisted.items ?? collections,
  exhibitions: exhibitions,
  searchKeyword: persisted.searchKeyword ?? '',
  selectedCategory: persisted.selectedCategory ?? null,
  selectedDynasty: persisted.selectedDynasty ?? null,
  currentItem: null,
  comments: persisted.comments ?? [],

  setSearchKeyword: (keyword: string) => {
    set({ searchKeyword: keyword });
    saveToStorage(get());
  },

  setCategory: (category: Category | null) => {
    set({ selectedCategory: category });
    saveToStorage(get());
  },

  setDynasty: (dynasty: Dynasty | null) => {
    set({ selectedDynasty: dynasty });
    saveToStorage(get());
  },

  setCurrentItem: (item: Collection | null) => {
    set({ currentItem: item });
  },

  addComment: (collectionId: string, userId: string, username: string, content: string, rating: number) => {
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      collectionId,
      userId,
      username,
      content,
      date: new Date().toISOString().split('T')[0],
      rating,
    };
    set({ comments: [...get().comments, comment] });
    saveToStorage(get());
  },

  incrementViewCount: (collectionId: string) => {
    const items = get().items.map((item) =>
      item.id === collectionId ? { ...item, viewCount: item.viewCount + 1 } : item
    );
    set({ items });
    saveToStorage(get());
  },
}));
