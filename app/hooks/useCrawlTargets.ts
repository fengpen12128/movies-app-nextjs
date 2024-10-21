import { useState } from 'react';

export const useCrawlTargets = (initialTargets: CrawlUrl[] = [{ url: "", maxPage: 1, save: false }]) => {
    const [targets, setTargets] = useState<CrawlUrl[]>(initialTargets);

    const addTarget = () => {
        setTargets([...targets, { url: "", maxPage: 1, save: false }]);
    };

    const removeTarget = (index: number) => {
        setTargets(targets.filter((_, i) => i !== index));
    };

    const updateTarget = (index: number, field: keyof CrawlUrl, value: string | number | boolean) => {
        const newTargets = [...targets];
        newTargets[index] = { ...newTargets[index], [field]: value };
        setTargets(newTargets);
    };

    const setAllTargets = (newTargets: CrawlUrl[]) => {
        setTargets(newTargets);
    };

    return {
        targets,
        addTarget,
        removeTarget,
        updateTarget,
        setAllTargets,
    };
};
