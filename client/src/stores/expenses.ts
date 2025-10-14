import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { userScopedStorage } from '../utils/userScopedStorage';

export type Expense = {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
};

type ExpenseState = {
  expenses: Expense[];
  addExpense: (e: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
};

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      expenses: [
        { id: 'e1', name: 'Groceried', amount: 54.32, category: 'Food', date: new Date().toISOString() },
        { id: 'e2', name: 'Gym', amount: 24.99, category: 'Health', date: new Date().toISOString() },
      ],
      addExpense: (e) => set((s) => ({ expenses: [...s.expenses, { id: crypto.randomUUID(), ...e }] })),
      deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((x) => x.id !== id) })),
    }),
    {
      name: 'expense-store',
      storage: createJSONStorage(() => userScopedStorage),
    }
  )
);