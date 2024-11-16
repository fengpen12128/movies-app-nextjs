import { z } from "zod"


export const movieSchema = z.object({
    id: z.number(),
    code: z.string(),
    prefix: z.string().nullable().optional(),
    duration: z.string().nullable().optional(),
    rate: z.number().nullable().optional(),
    rateNum: z.number().nullable().optional(),
    releaseDate: z.date().nullable().optional(),
    batchNum: z.string().nullable().optional(),
    actresses: z
        .array(z.object({ id: z.number().nullable(), actressName: z.string().nullable() }))
        .nullable().optional(),
    createdTime: z.date().nullable().optional(),
    updatedTime: z.date().nullable().optional(),
});

export type MovieTable = z.infer<typeof movieSchema>
