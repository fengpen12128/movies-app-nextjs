import { useState } from 'react';
import { message } from 'react-message-popup';
import { transformSourceData } from '@/app/actions/admin/script/sourceDataTran';
import { saveCrawlBatchRecord, updateTransStatus } from '@/app/actions/admin/crawl/afterAction';

export const useSpiderActions = () => {
    const [transferringBatches, setTransferringBatches] = useState<string[]>([]);
    const [downloadingBatches, setDownloadingBatches] = useState<string[]>([]);

    const handleTransData = async (batchId: string) => {
        if (!batchId) {
            message.error("batchId is null");
            return;
        }
        setTransferringBatches((prev) => [...prev, batchId]);
        try {
            await transformSourceData({ batchId, isFullData: false });
            message.success("Data transfer successful");
            await updateTransStatus(batchId);
        } catch (error) {
            message.error("Data migration failed");
            throw error;
        } finally {
            setTransferringBatches((prev) => prev.filter(id => id !== batchId));
        }
    };

    const handleSaveCrawlBatchRecord = async (batchId: string) => {
        try {
            const { code, msg } = await saveCrawlBatchRecord(batchId);
            if (code === 200) {
                message.success("Crawl batch record processed successfully");
            } else {
                message.error(`Failed to process crawl batch record: ${msg}`);
            }
        } catch (error) {
            throw error;
        }
    };

    const handleDownloadData = async (batchId: string) => {
        setDownloadingBatches((prev) => [...prev, batchId]);
        try {
            await fetch(`/api/crawl/action/download/${batchId}?mode=sync`);
            await updateMediaDownloadStatus(batchId);
            message.success("媒体下载完成");
        } catch (error) {
            console.error("Error downloading data:", error);
            message.error("媒体下载失败");
        } finally {
            setDownloadingBatches((prev) => prev.filter(id => id !== batchId));
        }
    };

    const updateMediaDownloadStatus = async (batchId: string) => {
        try {
            const response = await fetch("/api/crawl/action/download/updateStatus", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ batchId: batchId, downloadStatus: 1 }),
            });
            if (!response.ok) throw new Error("Failed to update download status");
            console.log("Download status updated");
        } catch (error) {
            console.error("Error updating download status:", error);
            message.error("更新下载状态失败");
        }
    };

    const executeSpiderEndActions = async (newBatchId: string | null) => {
        if (!newBatchId) return;
        await handleTransData(newBatchId);
        await handleSaveCrawlBatchRecord(newBatchId);
        // await handleDownloadData(newBatchId);
    };

    return {
        transferringBatches,
        downloadingBatches,
        executeSpiderEndActions,
    };
};
