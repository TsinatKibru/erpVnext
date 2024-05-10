import { JWTPayload } from 'jose'
import { z } from 'zod'
 
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
    repassword: z.string().min(8).optional(),
}).refine(data => data.password === data.repassword, {
  message: 'Passwords do not match',
  path: ['repassword'], // Set the error path to repassword
});

export const SigninFormSchema = z.object({
  
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string().trim(),
   
})
 
export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

  export interface SessionPayload extends JWTPayload   {
    userId: string; // User's unique identifier
    expiresAt: Date; // Expiration timestamp for the session
    // You can add other session-related data here (optional)
    // e.g., role: string, permissions: string[]
  }