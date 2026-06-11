import { create } from 'zustand';
import type { User } from '../data/users';

export interface Certificate {
  id: string;
  taskId: string;
  taskTitle: string;
  issueDate: string;
  score: number;
}

export interface Registration {
  id: string;
  activityId: string;
  activityTitle: string;
  registerDate: string;
  reminded: boolean;
}

export interface BrowseHistoryItem {
  id: string;
  collectionId: string;
  collectionTitle: string;
  collectionImage: string;
  browseDate: string;
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  favorites: string[];
  registrations: Registration[];
  certificates: Certificate[];
  browseHistory: BrowseHistoryItem[];

  login: (user: User) => void;
  logout: () => void;
  toggleFavorite: (collectionId: string) => void;
  addRegistration: (activityId: string, activityTitle: string) => void;
  toggleRemind: (registrationId: string) => void;
  addCertificate: (taskId: string, taskTitle: string, score: number) => void;
  addBrowseHistory: (collectionId: string, collectionTitle: string, collectionImage: string) => void;
}

const STORAGE_KEY = 'museum_user_store';

const loadFromStorage = (): Partial<UserStore> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load user store from localStorage', e);
  }
  return {};
};

const saveToStorage = (state: UserStore) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save user store to localStorage', e);
  }
};

const persisted = loadFromStorage();

export const useUserStore = create<UserStore>((set, get) => ({
  user: persisted.user ?? null,
  isLoggedIn: persisted.isLoggedIn ?? false,
  favorites: persisted.favorites ?? [],
  registrations: persisted.registrations ?? [],
  certificates: persisted.certificates ?? [],
  browseHistory: persisted.browseHistory ?? [],

  login: (user: User) => {
    const newState = { user, isLoggedIn: true };
    set(newState);
    saveToStorage(get());
  },

  logout: () => {
    const newState = { user: null, isLoggedIn: false };
    set(newState);
    saveToStorage(get());
  },

  toggleFavorite: (collectionId: string) => {
    const favorites = [...get().favorites];
    const index = favorites.indexOf(collectionId);
    if (index === -1) {
      favorites.push(collectionId);
    } else {
      favorites.splice(index, 1);
    }
    set({ favorites });
    saveToStorage(get());
  },

  addRegistration: (activityId: string, activityTitle: string) => {
    const existing = get().registrations.find((r) => r.activityId === activityId);
    if (existing) return;
    const registration: Registration = {
      id: `reg_${Date.now()}`,
      activityId,
      activityTitle,
      registerDate: new Date().toISOString().split('T')[0],
      reminded: false,
    };
    set({ registrations: [...get().registrations, registration] });
    saveToStorage(get());
  },

  toggleRemind: (registrationId: string) => {
    const registrations = get().registrations.map((r) =>
      r.id === registrationId ? { ...r, reminded: !r.reminded } : r
    );
    set({ registrations });
    saveToStorage(get());
  },

  addCertificate: (taskId: string, taskTitle: string, score: number) => {
    const existing = get().certificates.find((c) => c.taskId === taskId);
    if (existing) return;
    const certificate: Certificate = {
      id: `cert_${Date.now()}`,
      taskId,
      taskTitle,
      issueDate: new Date().toISOString().split('T')[0],
      score,
    };
    set({ certificates: [...get().certificates, certificate] });
    saveToStorage(get());
  },

  addBrowseHistory: (collectionId: string, collectionTitle: string, collectionImage: string) => {
    let history = get().browseHistory.filter((h) => h.collectionId !== collectionId);
    const item: BrowseHistoryItem = {
      id: `bh_${Date.now()}`,
      collectionId,
      collectionTitle,
      collectionImage,
      browseDate: new Date().toISOString().split('T')[0],
    };
    history = [item, ...history].slice(0, 50);
    set({ browseHistory: history });
    saveToStorage(get());
  },
}));
