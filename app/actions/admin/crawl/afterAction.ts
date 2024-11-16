'use server'

import prisma from "@/app/lib/prisma";


export async function saveCrawlBatchRecord(batchNum: string): Promise<DataResponse<void>> {
    try {
        // Query crawlSourceData for the current batch
        const sourceData = await prisma.crawlSourceData.findMany({
            where: { batchNum: batchNum },
        });

        // Insert data into CrawlBatchRecord
        await prisma.crawlBatchRecord.createMany({
            data: sourceData.map((item) => ({
                batchNum: batchNum,
                code: item.code ?? '',
                type: item.updatedTime ? 2 : 1, // 1 for new, 2 for update
            })),
        });

        return {
            code: 200,
            msg: "Crawl batch record processed successfully"
        };
    } catch (error) {
        console.error("Error processing crawl batch record:", error);
        return {
            code: 500,
            msg: `Error processing crawl batch record: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}



export async function updateTransStatus(batchNum: string): Promise<DataResponse<boolean>> {
    try {


        // 使用 Promise.all 并行查询新增数和更新数
        const [newCount, updateCount] = await Promise.all([
            prisma.crawlSourceData.count({
                where: {
                    batchNum: batchNum,
                    updatedTime: null,
                },
            }),
            prisma.crawlSourceData.count({
                where: {
                    batchNum: batchNum,
                    updatedTime: {
                        not: null,
                    },
                },
            }),
        ]);

        await prisma.crawlStat.update({
            where: { batchNum: batchNum },
            data: {
                transStatus: 1,
                newlyIncreasedNum: newCount,
                updatedNum: updateCount,
            },
        });

        return {
            data: true,
            code: 200
        };
    } catch (error) {
        console.error("Error updating crawl stat:", error);
        return {
            msg: `Failed to update crawl stat: ${error instanceof Error ? error.message : String(error)}`,
            code: 500
        };
    }
}
