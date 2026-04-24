import { z } from 'zod';

/** Aligns with backend `LoginRequest` (@Email, @NotBlank). */
export const loginEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(255, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(100, 'Password must be at most 100 characters'),
});

/** Aligns with backend `RegisterRequest` (displayName, email, password 6–100). */
export const registerSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(150, 'Full name must be at most 150 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Enter a valid email address')
      .max(255, 'Email is too long'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be at most 100 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
