import {z} from 'zod'

export const acceptMessageSchema = z.object({
    Content: z
        .string()
        .min(10, {message: 'Content must be 10 characters'})
        .max(300, {message: 'Content must be no more longer than 300 characters'})
})