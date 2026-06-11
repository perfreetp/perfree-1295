import { create } from 'zustand';
import { activities, type Activity } from '../data/activities';

interface ActivityStore {
  activities: Activity[];
  selectedDate: string | null;
  currentActivity: Activity | null;

  setSelectedDate: (date: string | null) => void;
  setCurrentActivity: (activity: Activity | null) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
}

const STORAGE_KEY = 'museum_activity_store';

const loadFromStorage = (): Partial<ActivityStore> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        activities: parsed.activities,
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
      activities: state.activities,
      selectedDate: state.selectedDate,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save activity store to localStorage', e);
  }
};

const persisted = loadFromStorage();

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: persisted.activities ?? activities,
  selectedDate: persisted.selectedDate ?? null,
  currentActivity: null,

  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
    saveToStorage(get());
  },

  setCurrentActivity: (activity: Activity | null) => {
    set({ currentActivity: activity });
  },

  addActivity: (activity: Activity) => {
    set({ activities: [...get().activities, activity] });
    saveToStorage(get());
  },

  updateActivity: (id: string, updates: Partial<Activity>) => {
    const activities = get().activities.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    );
    set({ activities });
    saveToStorage(get());
  },

  deleteActivity: (id: string) => {
    set({ activities: get().activities.filter((a) => a.id !== id) });
    saveToStorage(get());
  },
}));
