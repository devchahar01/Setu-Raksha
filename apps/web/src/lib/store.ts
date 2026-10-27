import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FormStateStore {
  activeLocale: "en" | "hi" | "mr";
  useDevanagariDigits: boolean;
  draftAuditForm: Record<string, unknown>;
  setLocale: (locale: "en" | "hi" | "mr") => void;
  setActiveLocale: (locale: "en" | "hi" | "mr") => void;
  toggleDigits: () => void;
  updateDraftAudit: (key: string, value: unknown) => void;
  clearDraft: () => void;
}

export const useAppStore = create<FormStateStore>()(
  persist(
    (set) => ({
      activeLocale: "en",
      useDevanagariDigits: false,
      draftAuditForm: {},
      setLocale: (locale) => {
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
        }
        set({ activeLocale: locale });
      },
      setActiveLocale: (locale) => {
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
        }
        set({ activeLocale: locale });
      },
      toggleDigits: () => set((state) => ({ useDevanagariDigits: !state.useDevanagariDigits })),
      updateDraftAudit: (key, value) =>
        set((state) => ({
          draftAuditForm: {
            ...state.draftAuditForm,
            [key]: value,
          },
        })),
      clearDraft: () => set({ draftAuditForm: {} }),
    }),
    {
      name: "setu_rakshak_app_store",
    }
  )
);
