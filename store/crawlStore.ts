import { create } from 'zustand';

interface CrawlState {
    batchNum: string | null;
    setbatchNum: (id: string | null) => void;
}

const useCrawlStore = create<CrawlState>((set) => ({
    batchNum: null,
    setbatchNum: (id) => set({ batchNum: id }),
}));

export default useCrawlStore;
