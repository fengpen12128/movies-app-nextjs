import { z } from "zod";

export const scheduleCrawlUrlSchema = z.object({
    web: z.string(),
    url: z.string(),  // 用作唯一标识符
    createdTime: z.date().optional()
});

export type ScheduleCrawlUrl = z.infer<typeof scheduleCrawlUrlSchema>;
