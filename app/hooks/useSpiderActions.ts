import { useState } from 'react';
import { message } from 'react-message-popup';
import { transformSourceData } from '@/app/actions/admin/script/sourceDataTran';
import { saveCrawlBatchRecord, updateTransStatus } from '@/app/actions/admin/crawl/afterAction';

export const useSpiderActions = () => {
    const [transferringBatches, setTransferringBatches] = useState<string[]>([]);
    const [downloadingBatches, setDownloadingBatches] = useState<string[]>([]);

    const handleTransData = async (batchNum: string) => {
        if (!batchNum) {
            message.error("batchNum is null");
            return;
        }
        setTransferringBatches((prev) => [...prev, batchNum]);
        try {
            await transformSourceData({ batchNum, isFullData: false });
            message.success("Data transfer successful");
            await updateTransStatus(batchNum);
        } catch (error) {
            message.error("Data migration failed");
            throw error;
        } finally {
            setTransferringBatches((prev) => prev.filter(id => id !== batchNum));
        }
    };

    const handleSaveCrawlBatchRecord = async (batchNum: string) => {
        try {
            const { code, msg } = await saveCrawlBatchRecord(batchNum);
            if (code === 200) {
                message.success("Crawl batch record processed successfully");
            } else {
                message.error(`Failed to process crawl batch record: ${msg}`);
            }
        } catch (error) {
            throw error;
        }
    };

    const handleDownloadData = async (batchNum: string) => {
        setDownloadingBatches((prev) => [...prev, batchNum]);
        try {
            await fetch(`/api/crawl/action/download/${batchNum}?mode=sync`);
            await updateMediaDownloadStatus(batchNum);
            message.success("媒体下载完成");
        } catch (error) {
            console.error("Error downloading data:", error);
            message.error("媒体下载失败");
        } finally {
            setDownloadingBatches((prev) => prev.filter(id => id !== batchNum));
        }
    };

    const updateMediaDownloadStatus = async (batchNum: string) => {
        try {
            const response = await fetch("/api/crawl/action/download/updateStatus", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ batchNum: batchNum, downloadStatus: 1 }),
            });
            if (!response.ok) throw new Error("Failed to update download status");
            console.log("Download status updated");
        } catch (error) {
            console.error("Error updating download status:", error);
            message.error("更新下载状态失败");
        }
    };

    const executeSpiderEndActions = async (newbatchNum: string | null) => {
        if (!newbatchNum) return;
        await handleTransData(newbatchNum);
        await handleSaveCrawlBatchRecord(newbatchNum);
        // await handleDownloadData(newbatchNum);
    };

    return {
        transferringBatches,
        downloadingBatches,
        executeSpiderEndActions,
    };
};
