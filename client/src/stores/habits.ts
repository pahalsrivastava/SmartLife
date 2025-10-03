import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dayjs from 'dayjs';

export type Habit = {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  datesCompleted: string[];
};

type HabitState = {
  habits: Habit[];
  addHabit: (h: Omit<Habit, 'id' | 'datesCompleted'>) => void;
  deleteHabit: (id: string) => void;
  toggleToday: (id: string) => void;
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [
        { id: 'h1', name: 'Morning Run', frequency: 'daily', datesCompleted: [] },
        { id: 'h2', name: 'Read 20 mins', frequency: 'daily', datesCompleted: [] },
        { id: 'h3', name: 'Deep Clean', frequency: 'weekly', datesCompleted: [] },
      ],
      addHabit: (h) =>
        set((s) => ({
          habits: [...s.habits, { id: crypto.randomUUID(), datesCompleted: [], ...h }],
        })),
      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((x) => x.id !== id) })),
      toggleToday: (id) => {
        const today = dayjs().format('YYYY-MM-DD');
        const habits = get().habits.map((h) => {
          if (h.id !== id) return h;
          const done = h.datesCompleted.includes(today);
          return {
            ...h,
            datesCompleted: done
              ? h.datesCompleted.filter((d) => d !== today)
              : [...h.datesCompleted, today],
          };
        });
        set({ habits });
      },
    }),
    { name: 'habit-store' }
  )
);