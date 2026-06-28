import { z } from 'zod';

/**
 * Shared password rule across sign-in and sign-up. Kept deliberately
 * simple (length only) rather than forcing arbitrary complexity rules —
 * length is the strongest practical signal for password strength, and
 * complexity mandates push people toward predictable substitutions
 * ("Password1!") that don't actually add entropy.
 */
const emailSchema = z
  .string()
  .min(1, 'Enter your email.')
  .email('That email address doesn\u2019t look right.');

const passwordSchema = z
  .string()
  .min(8, 'Use at least 8 characters.');

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Enter your password.'),
});

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\u2019t match.',
    path: ['confirmPassword'],
  });

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
