import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const prefixCodeSchema = z.object({
    prefix: z.string(),
    num: z.number(),
    maker: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
})

export type PrefixCodes = z.infer<typeof prefixCodeSchema>
