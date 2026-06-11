import { create } from 'zustand';
import { activities, type Activity } from '../data/activities';

interface ActivityStore {
  activities: Activity[];
  selectedDate: string | null;
  currentActivity: Activity | null;

  setSelectedDate: (date: string | null) => void;
  setCurrentActivity: (activity: Activity | null) => void;
}

const STORAGE_KEY = 'museum_activity_store';

const loadFromStorage = (): Partial<ActivityStore> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        selectedDate: parsed.selectedDate,
      };
    }
  } catch (e) {
    console.error('Failed to load activity store from localStorage', e);
  }
  return {};
};

const saveToStorage = (state: ActivityStore) => {
  try {
    const toSave = {
      selectedDate: state.selectedDate,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save activity store to localStorage', e);
  }
};

const persisted = loadFromStorage();

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: activities,
  selectedDate: persisted.selectedDate ?? null,
  currentActivity: null,

  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
    saveToStorage(get());
  },

  setCurrentActivity: (activity: Activity | null) => {
    set({ currentActivity: activity });
  },
}));
