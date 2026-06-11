import { create } from 'zustand';
import { learningTasks, type LearningTask } from '../data/learning';

export type TaskProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface TaskProgress {
  status: TaskProgressStatus;
  score: number;
  completedDate?: string;
}

interface LearningStore {
  tasks: LearningTask[];
  currentTask: LearningTask | null;
  currentQuizIndex: number;
  userAnswers: Record<string, number>;
  taskProgress: Record<string, TaskProgress>;

  setCurrentTask: (task: LearningTask | null) => void;
  selectAnswer: (quizIndex: number, optionIndex: number) => void;
  nextQuiz: () => void;
  resetTask: (taskId: string) => void;
  completeTask: (taskId: string) => number;
}

const STORAGE_KEY = 'museum_learning_store';

const loadFromStorage = (): Partial<LearningStore> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        currentTask: parsed.currentTask,
        currentQuizIndex: parsed.currentQuizIndex,
        userAnswers: parsed.userAnswers,
        taskProgress: parsed.taskProgress,
      };
    }
  } catch (e) {
    console.error('Failed to load learning store from localStorage', e);
  }
  return {};
};

const saveToStorage = (state: LearningStore) => {
  try {
    const toSave = {
      currentTask: state.currentTask,
      currentQuizIndex: state.currentQuizIndex,
      userAnswers: state.userAnswers,
      taskProgress: state.taskProgress,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save learning store to localStorage', e);
  }
};

const persisted = loadFromStorage();

export const useLearningStore = create<LearningStore>((set, get) => ({
  tasks: learningTasks,
  currentTask: persisted.currentTask ?? null,
  currentQuizIndex: persisted.currentQuizIndex ?? 0,
  userAnswers: persisted.userAnswers ?? {},
  taskProgress: persisted.taskProgress ?? {},

  setCurrentTask: (task: LearningTask | null) => {
    set({ currentTask: task, currentQuizIndex: 0 });
    if (task) {
      const progress = get().taskProgress[task.id];
      if (!progress || progress.status === 'not_started') {
        set({
          taskProgress: {
            ...get().taskProgress,
            [task.id]: { status: 'in_progress', score: 0 },
          },
          userAnswers: {},
        });
      }
    }
    saveToStorage(get());
  },

  selectAnswer: (quizIndex: number, optionIndex: number) => {
    const currentTask = get().currentTask;
    if (!currentTask) return;
    const key = `${currentTask.id}_${quizIndex}`;
    set({
      userAnswers: { ...get().userAnswers, [key]: optionIndex },
    });
    saveToStorage(get());
  },

  nextQuiz: () => {
    const currentTask = get().currentTask;
    if (!currentTask) return;
    const nextIndex = get().currentQuizIndex + 1;
    if (nextIndex < currentTask.quizzes.length) {
      set({ currentQuizIndex: nextIndex });
      saveToStorage(get());
    }
  },

  resetTask: (taskId: string) => {
    const { taskProgress, userAnswers, currentTask } = get();
    const newProgress = { ...taskProgress };
    delete newProgress[taskId];
    const newAnswers: Record<string, number> = {};
    Object.keys(userAnswers).forEach((key) => {
      if (!key.startsWith(`${taskId}_`)) {
        newAnswers[key] = userAnswers[key];
      }
    });
    set({
      taskProgress: newProgress,
      userAnswers: newAnswers,
      currentQuizIndex: currentTask?.id === taskId ? 0 : get().currentQuizIndex,
    });
    saveToStorage(get());
  },

  completeTask: (taskId: string): number => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return 0;

    let correctCount = 0;
    task.quizzes.forEach((quiz, index) => {
      const key = `${taskId}_${index}`;
      const userAnswer = get().userAnswers[key];
      if (userAnswer === quiz.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / task.quizzes.length) * 100);

    set({
      taskProgress: {
        ...get().taskProgress,
        [taskId]: {
          status: 'completed',
          score,
          completedDate: new Date().toISOString().split('T')[0],
        },
      },
    });
    saveToStorage(get());

    return score;
  },
}));
