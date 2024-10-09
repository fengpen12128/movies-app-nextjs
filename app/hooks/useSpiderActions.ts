import { useState } from 'react';
import { message } from 'react-message-popup';

export const useSpiderActions = () => {
    const [isTransferring, setIsTransferring] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleTransData = async (batchId: string | null) => {
        if (!batchId) {
            message.error("batchId is null");
            return;
        }
        setIsTransferring(true);
        try {
            await fetch(`/api/crawl/action/trans/${batchId}`);
            message.success("数据迁移成功");
            await updateTransStatus(batchId);
        } catch (error) {
            console.error("Error transferring data:", error);
            message.error("数据迁移失败");
        } finally {
            setIsTransferring(false);
        }
    };

    const handleDownloadData = async (batchId: string | null) => {
        if (!batchId) return;
        setIsDownloading(true);
        try {
            await fetch(`/api/crawl/action/download/${batchId}?mode=sync`);
            await updateMediaDownloadStatus(batchId);
            message.success("媒体下载完成");
        } catch (error) {
            console.error("Error downloading data:", error);
            message.error("媒体下载失败");
        } finally {
            setIsDownloading(false);
        }
    };

    const updateMediaDownloadStatus = async (batchId: string | null) => {
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

    const updateTransStatus = async (batchId: string | null) => {
        if (!batchId) return;
        try {
            const response = await fetch("/api/crawl/action/trans/updateStatus", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ batchId: batchId, transStatus: 1 }),
            });
            if (!response.ok) throw new Error("Failed to update trans status");
            console.log("Trans status updated");
        } catch (error) {
            console.error("Error updating trans status:", error);
            message.error("更新迁移状态失败");
        }
    };

    const executeSpiderEndActions = async (newBatchId: string | null) => {
        await handleTransData(newBatchId);
        await handleDownloadData(newBatchId);
    };

    return {
        isTransferring,
        isDownloading,
        executeSpiderEndActions,
    };
};
