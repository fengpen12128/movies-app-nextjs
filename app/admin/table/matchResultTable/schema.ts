import { z } from "zod"

export const matchResultSchema = z.object({
    matchCode: z.string().optional().nullable(),
    path: z.string(),
    size: z.union([z.number(), z.string()]).optional().nullable(),
    downloadDate: z.date().optional().nullable(),
    isMatched: z.boolean(),
})

export type MatchResult = z.infer<typeof matchResultSchema>
