import { create } from "zustand";

export interface FormStateStore {
  activeLocale: "en" | "hi" | "mr";
  useDevanagariDigits: boolean;
  draftAuditForm: Record<string, unknown>;
  setLocale: (locale: "en" | "hi" | "mr") => void;
  toggleDigits: () => void;
  updateDraftAudit: (key: string, value: unknown) => void;
  clearDraft: () => void;
}

export const useAppStore = create<FormStateStore>((set) => ({
  activeLocale: "en",
  useDevanagariDigits: false,
  draftAuditForm: {},
  setLocale: (locale) => set({ activeLocale: locale }),
  toggleDigits: () => set((state) => ({ useDevanagariDigits: !state.useDevanagariDigits })),
  updateDraftAudit: (key, value) =>
    set((state) => ({
      draftAuditForm: {
        ...state.draftAuditForm,
        [key]: value,
      },
    })),
  clearDraft: () => set({ draftAuditForm: {} }),
}));
