import { z } from "zod"

// Enum for execution type status
export const ExeTypeStatus = {
    MANUAL: "temp",
    AUTO: "AUTO",
} as const

// Enum for crawl status
export const CrawlStatus = {
    PENDING: "pending",
    RUNNING: "running",
    FINISHED: "finished",
    NOT_FOUND: "not_found",
    ERROR: "error",
} as const

// Enum for translation status
export const TransStatus = {
    NOT_STARTED: "NOT_STARTED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
} as const

export const crawlerInfoSchema = z.object({
    batchNum: z.string().optional().nullable(),
    newlyIncreasedNum: z.number().int().nonnegative().optional().nullable(),
    updatedNum: z.number().int().nonnegative().optional().nullable(),
    startedTime: z.date().optional().nullable(),
    endTime: z.date().optional().nullable(),
    exeTypeStatus: z.enum([ExeTypeStatus.MANUAL, ExeTypeStatus.AUTO]).optional().nullable(),
    crawlStatus: z.enum([
        CrawlStatus.PENDING,
        CrawlStatus.RUNNING,
        CrawlStatus.FINISHED,
        CrawlStatus.NOT_FOUND,
        CrawlStatus.ERROR,
    ]).optional().nullable(),
    transStatus: z.number().int().nonnegative().optional().nullable(),
    jobId: z.string().optional().nullable(),
    isFinished: z.boolean().optional().nullable(),
})

export type CrawlerInfos = z.infer<typeof crawlerInfoSchema>
