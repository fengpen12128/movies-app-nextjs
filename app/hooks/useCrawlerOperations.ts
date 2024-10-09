import { useState, useEffect, useCallback } from 'react';
import { message } from 'react-message-popup';
import { UrlParams } from '@/app/types/crawlerTypes';

interface CrawlState {
    status: string;
    batchId: string | null;
    jobId: string;
}

export const useCrawlerOperations = (
    initialState: CrawlState,
    targets: UrlParams[],
) => {


    const [crawlState, setCrawlState] = useState<CrawlState>(initialState);
    const [showStopDialog, setShowStopDialog] = useState(false);
    const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

    const checkSpiderStatus = useCallback(async (jobId: string, onFinished: (batchId: string) => void, batchId: string) => {
        try {
            const response = await fetch(
                `/api/crawl/action/statusGet?jobId=${jobId}`
            );
            const data = await response.json();

            if (data.status === "finished") {
                setCrawlState(prevState => ({ ...prevState, status: "completed" }));
                if (statusCheckInterval) {
                    clearInterval(statusCheckInterval);
                }
                setStatusCheckInterval(null);
                message.success("Crawling completed");
                onFinished(batchId!);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error checking spider status:", err);
            return false;
        }
    }, [statusCheckInterval]);

    const intervalCheckSpiderStatus = (jobId: string, onFinished: (batchId: string) => void, batchId: string) => {
        if (!jobId || !batchId) {
            message.error("jobId or batchId is empty");
            return;
        }
        const statusInterval = setInterval(
            () => checkSpiderStatus(jobId, onFinished, batchId),
            1000
        );
        setStatusCheckInterval(statusInterval);
    }

    const startCrawling = async (onFinished: (batchId: string) => void) => {
        const handleCrawlParams = () => ({
            urls: targets.map(({ url, maxPages }) => [url, maxPages]),
        });

        try {
            const response = await fetch("/api/crawl/action/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(handleCrawlParams()),
            });

            if (!response.ok) {
                message.error("Failed to start spider");
                return;
            }

            const res = await response.json();

            setCrawlState(prevState => ({
                ...prevState,
                jobId: res.jobId,
                batchId: res.batchId,
                status: "running"
            }));

            if (res.jobId) {
                const statusInterval = setInterval(
                    () => checkSpiderStatus(res.jobId, onFinished, res.batchId),
                    1000
                );
                setStatusCheckInterval(statusInterval);
            }
        } catch (err) {
            console.error("Error:", err);
            message.error("Failed to start spider");
        }
    };

    const stopCrawling = () => {
        setShowStopDialog(true);
    };

    const confirmStopCrawling = () => {
        setCrawlState(prevState => ({ ...prevState, status: "idle" }));
        if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
        }
        setShowStopDialog(false);
    };

    useEffect(() => {
        return () => {
            if (statusCheckInterval) {
                clearInterval(statusCheckInterval);
            }
        };
    }, [statusCheckInterval]);

    return {
        crawlState,
        showStopDialog,
        setCrawlState,
        intervalCheckSpiderStatus,
        setShowStopDialog,
        startCrawling,
        stopCrawling,
        confirmStopCrawling,
    };
};
