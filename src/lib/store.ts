import { create } from "zustand";
import type { CountryCode } from "./constants";

interface AppState {
  sessionId: string;
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  locationQuery: string;
  setLocationQuery: (l: string) => void;
  filters: {
    category: string;
    type: string;
    mode: string;
    experience: string;
    salaryMin: string;
    salaryMax: string;
  };
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

function generateSessionId() {
  if (typeof window === "undefined") return "server";
  const stored = localStorage.getItem("ajilmn-session");
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem("ajilmn-session", id);
  return id;
}

const defaultFilters = { category: "", type: "", mode: "", experience: "", salaryMin: "", salaryMax: "" };

export const useAppStore = create<AppState>((set) => ({
  sessionId: generateSessionId(),
  country: "JP",
  setCountry: (c) => set({ country: c, filters: { ...defaultFilters }, searchQuery: "", locationQuery: "" }),
  userEmail: "",
  setUserEmail: (email) => set({ userEmail: email }),
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  locationQuery: "",
  setLocationQuery: (l) => set({ locationQuery: l }),
  filters: { ...defaultFilters },
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  clearFilters: () => set({ filters: { ...defaultFilters }, searchQuery: "", locationQuery: "" }),
}));
