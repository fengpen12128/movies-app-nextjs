import { create } from "zustand";

const usePageStore = create((set) => ({
  pagination: null,
  setPagination: (pagination) => set({ pagination }),
}));

export default usePageStore;
