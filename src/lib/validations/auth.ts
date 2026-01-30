import { z } from "zod";

// Ortak validasyon mesajları
const messages = {
  email: {
    required: "E-posta adresi zorunludur",
    invalid: "Geçerli bir e-posta adresi giriniz",
  },
  password: {
    required: "Şifre zorunludur",
    min: "Şifre en az 8 karakter olmalıdır",
    max: "Şifre en fazla 100 karakter olabilir",
    uppercase: "Şifre en az bir büyük harf içermelidir",
    lowercase: "Şifre en az bir küçük harf içermelidir",
    number: "Şifre en az bir rakam içermelidir",
  },
  username: {
    required: "Kullanıcı adı zorunludur",
    min: "Kullanıcı adı en az 3 karakter olmalıdır",
    max: "Kullanıcı adı en fazla 20 karakter olabilir",
    invalid: "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir",
  },
  confirmPassword: {
    required: "Şifre tekrarı zorunludur",
    mismatch: "Şifreler eşleşmiyor",
  },
  terms: {
    required: "Kullanım şartlarını kabul etmelisiniz",
  },
} as const;

// E-posta validasyonu
const emailSchema = z
  .string({ required_error: messages.email.required })
  .min(1, messages.email.required)
  .email(messages.email.invalid);

// Şifre validasyonu (güçlü şifre)
const passwordSchema = z
  .string({ required_error: messages.password.required })
  .min(8, messages.password.min)
  .max(100, messages.password.max)
  .regex(/[A-Z]/, messages.password.uppercase)
  .regex(/[a-z]/, messages.password.lowercase)
  .regex(/[0-9]/, messages.password.number);

// Basit şifre validasyonu (giriş için)
const simplePasswordSchema = z
  .string({ required_error: messages.password.required })
  .min(1, messages.password.required);

// Kullanıcı adı validasyonu
const usernameSchema = z
  .string({ required_error: messages.username.required })
  .min(3, messages.username.min)
  .max(20, messages.username.max)
  .regex(/^[a-zA-Z0-9_]+$/, messages.username.invalid);

// Giriş şeması
export const loginSchema = z.object({
  email: emailSchema,
  password: simplePasswordSchema,
  rememberMe: z.boolean().optional().default(false),
});

// Kayıt şeması
export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string({ required_error: messages.confirmPassword.required }),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: messages.terms.required }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: messages.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

// Şifremi unuttum şeması
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Şifre sıfırlama şeması
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string({ required_error: messages.confirmPassword.required }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: messages.confirmPassword.mismatch,
    path: ["confirmPassword"],
  });

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
