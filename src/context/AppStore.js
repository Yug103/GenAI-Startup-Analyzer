import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      savedReports: [],
      drafts: [],
      activeIdea: null,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, savedReports: [], drafts: [], activeIdea: null }),
      addReport: (report) => set((state) => ({ savedReports: [report, ...state.savedReports] })),
      removeReport: (id) => set((state) => ({ savedReports: state.savedReports.filter(r => r.id !== id) })),
      saveDraft: (draft) => set((state) => ({ drafts: [draft, ...state.drafts.filter(d => d.id !== draft.id)] })),
      removeDraft: (id) => set((state) => ({ drafts: state.drafts.filter(d => d.id !== id) })),
      setActiveIdea: (idea) => set({ activeIdea: idea }),
      clearActiveIdea: () => set({ activeIdea: null })
    }),
    {
      name: 'genai-startup-analyzer-storage',
    }
  )
);
