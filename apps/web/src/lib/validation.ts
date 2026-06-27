import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const createCardSchema = z.object({
  name: z.string().min(1, "Card name is required"),
  bank: z.string().min(1, "Bank name is required"),
  totalLimit: z.coerce.number().positive("Total limit must be positive"),
  cutoffDay: z.coerce
    .number()
    .int()
    .min(1, "Cutoff day must be between 1 and 30")
    .max(30, "Cutoff day must be between 1 and 30"),
  paymentDay: z.coerce
    .number()
    .int()
    .min(1, "Payment day must be between 1 and 30")
    .max(30, "Payment day must be between 1 and 30"),
  interestRate: z.coerce.number().min(0, "Interest rate must be non-negative"),
  currencyCode: z.string().length(3, "Currency code must be 3 characters"),
})

export const updateCardSchema = z.object({
  name: z.string().min(1, "Card name is required"),
  bank: z.string().min(1, "Bank name is required"),
  totalLimit: z.coerce.number().positive("Total limit must be positive"),
  cutoffDay: z.coerce
    .number()
    .int()
    .min(1, "Cutoff day must be between 1 and 30")
    .max(30, "Cutoff day must be between 1 and 30"),
  paymentDay: z.coerce
    .number()
    .int()
    .min(1, "Payment day must be between 1 and 30")
    .max(30, "Payment day must be between 1 and 30"),
  interestRate: z.coerce.number().min(0, "Interest rate must be non-negative"),
  currencyCode: z.string().length(3, "Currency code must be 3 characters"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const createTransactionSchema = z.object({
  cardId: z.string().min(1, "Card ID is required"),
  type: z.enum(["PURCHASE", "PAYMENT", "ADVANCE"], {
    error: "Type must be PURCHASE, PAYMENT, or ADVANCE",
  }),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  installments: z.coerce.number().int().min(0).default(0),
  budgetId: z.string().optional(),
})

export type CreateCardInput = z.infer<typeof createCardSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
