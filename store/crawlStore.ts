import { create } from 'zustand';

interface CrawlState {
    batchId: string | null;
    setBatchId: (id: string | null) => void;
}

const useCrawlStore = create<CrawlState>((set) => ({
    batchId: null,
    setBatchId: (id) => set({ batchId: id }),
}));

export default useCrawlStore;
