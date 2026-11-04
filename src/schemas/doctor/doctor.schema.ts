import { z } from "zod";

export const doctorQuerySchema = z.object({
    search: z.string().optional(),
    specialty: z.string().optional(),
    city: z.string().optional(),
    minFee: z.coerce.number().optional(),
    maxFee: z.coerce.number().optional(),
    experience: z.coerce.number().optional(),
    minRating: z.coerce.number().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
    sortBy: z.enum(["rating", "experience", "fee", "createdAt"]).default("rating"),
})

export type DoctorQuery = z.infer<typeof doctorQuerySchema>;