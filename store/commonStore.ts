import { create } from "zustand";

interface PageState {
    pagination: PaginationData | null;
    setPagination: (pagination: PaginationData | null) => void;
}

const usePageStore = create<PageState>((set) => ({
    pagination: null,
    setPagination: (pagination: PaginationData | null) => set({ pagination }),
}));

export default usePageStore;
