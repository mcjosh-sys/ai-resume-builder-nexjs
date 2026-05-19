import { AISuggestion } from "@/features/ai/prompts";
import { AppError } from "@/lib/errors";
import { create } from "zustand";

type SuggestionStore = {
  suggestions: AISuggestion[];
  isSuggesting: boolean;
  error: AppError | null;
  setSuggestions: (suggestions: AISuggestion[]) => void;
  setIsSuggesting: (isSuggesting: boolean) => void;
  setError: (error: AppError | null) => void;
  clearSuggestions: () => void;
  removeSuggestion: (id: string) => void;
};

export const useAISuggestionStore = create<SuggestionStore>((set) => ({
  suggestions: [],
  isSuggesting: false,
  error: null,
  setSuggestions: (suggestions) => set({ suggestions }),
  setIsSuggesting: (isSuggesting) => set({ isSuggesting }),
  setError: (error) => set({ error }),
  clearSuggestions: () => set({ suggestions: [] }),
  removeSuggestion: (id) =>
    set((state) => ({
      suggestions: state.suggestions.filter((s) => s.id !== id),
    })),
}));
