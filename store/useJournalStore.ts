import { create } from 'zustand';

interface JournalEntry {
  id: string;
  content: string;
  emotion?: string;
  insight?: string;
  createdAt: Date;
}

interface JournalState {
  entries: JournalEntry[];
  currentEntry: string;
  isLoading: boolean;
  error: string | null;
  addEntry: (entry: JournalEntry) => void;
  setCurrentEntry: (text: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearEntries: () => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  currentEntry: '',
  isLoading: false,
  error: null,
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  setCurrentEntry: (text) => set({ currentEntry: text }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearEntries: () => set({ entries: [] }),
}));
