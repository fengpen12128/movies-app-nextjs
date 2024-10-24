import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const prefixCodeSchema = z.object({
    code: z.string(),
    num: z.number(),
    brand: z.string().nullable().optional(),
    score: z.number().nullable().optional(),
})

export type PrefixCode = z.infer<typeof prefixCodeSchema>
