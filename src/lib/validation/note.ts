import { z } from 'zod'

// zod allows creation of form validation schema
export const createNoteSchema = z.object({
    title: z.string().min(1, {message: 'A title is required when submitting a Note'}),
    content: z.string().optional()
});

// Zod also allows the creation on Types based on these schema
export type CreateNoteSchema = z.infer<typeof createNoteSchema>