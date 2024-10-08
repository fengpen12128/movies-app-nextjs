import { useState } from 'react';
import { UrlParams } from '@/app/types/crawlerTypes';

export const useCrawlTargets = (initialTargets: UrlParams[] = [{ url: "", maxPages: 1 }]) => {
    const [targets, setTargets] = useState<UrlParams[]>(initialTargets);

    const addTarget = () => {
        setTargets([...targets, { url: "", maxPages: 1 }]);
    };

    const removeTarget = (index: number) => {
        setTargets(targets.filter((_, i) => i !== index));
    };

    const updateTarget = (index: number, field: keyof UrlParams, value: string | number) => {
        const newTargets = [...targets];
        newTargets[index] = { ...newTargets[index], [field]: value };
        setTargets(newTargets);
    };

    const setAllTargets = (newTargets: UrlParams[]) => {
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
