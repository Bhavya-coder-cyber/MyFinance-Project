import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(15, "Username must be at most 15 characters long")
    .regex(/^[a-zA-Z0-9._-]+$/, "Username must only contain letters, numbers, underscores, dots, and hyphens")

export const signupSchema = z.object({
    fullname: z.string().min(3, "Full name must be at least 3 characters long"),
    username: usernameValidation,
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})