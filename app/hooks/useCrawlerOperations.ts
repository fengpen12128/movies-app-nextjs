import { useState, useEffect, useCallback } from 'react';
import { message } from 'react-message-popup';
import { getSpiderStatus, runCrawl } from '@/app/actions/admin/crawl';
import { addScheduleCrawlUrl } from '@/app/actions/admin/dashboard';

interface CrawlState {
    status: string;
    batchId: string | null;
    jobId: string;
}

export const useCrawlerOperations = (
    initialState: CrawlState,
    targets: CrawlUrl[],
) => {


    const [crawlState, setCrawlState] = useState<CrawlState>(initialState);
    const [showStopDialog, setShowStopDialog] = useState(false);
    const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

    const checkSpiderStatus = useCallback(async (jobId: string, onFinished: (batchId: string) => void, batchId: string) => {
        try {
            const { data: crawlStatus, code, msg } = await getSpiderStatus(jobId);

            if (crawlStatus === "finished") {
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

    const saveCrawlUrls = async (crawlUrls: CrawlUrl[]) => {
        crawlUrls = crawlUrls.filter(url => url.save);
        crawlUrls.forEach(async crawlUrl => {
            const { code, msg } = await addScheduleCrawlUrl({ ...crawlUrl, web: "Javdb", url: crawlUrl.url });
            if (code !== 200) {
                message.error(msg!);
                return;
            }
        })
    }

    const startCrawling = async (onFinished: (batchId: string) => void) => {
        try {
            const { data: res, code, msg } = await runCrawl({ urls: targets });
            if (code !== 200 || !res) {
                message.error(msg!);
                return;
            }
            await saveCrawlUrls(targets);
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
