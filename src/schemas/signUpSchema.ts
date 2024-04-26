import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(5,"Username must be atleat 5 characters.")
    .max(10, "Username must be no more than 10 characters")
    .regex(/^(?![^a-zA-Z0-9]+$)[a-zA-Z0-9]+$/, "special character not allowed");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email Address"}),
    Password: z.string().min(8,{message: 'password must be 8 charcters'}).max(15,{message: "password must no more longer than 15 characters"})
})
