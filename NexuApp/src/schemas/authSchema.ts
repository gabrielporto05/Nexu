import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .refine(val => /[a-zA-Z]/.test(val), {
      message: 'A senha deve conter pelo menos uma letra'
    })
    .refine(val => /\d/.test(val), {
      message: 'A senha deve conter pelo menos um número'
    })
})

export const RegisterSchema = z
  .object({
    name: z.string().min(3, 'O campo name deve ter no mínimo 3 caracteres'),
    nick: z.string().min(3, 'O campo nick deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .refine(val => /[a-zA-Z]/.test(val), {
        message: 'A senha deve conter pelo menos uma letra'
      })
      .refine(val => /\d/.test(val), {
        message: 'A senha deve conter pelo menos um número'
      }),
    confirm_password: z.string()
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password']
  })

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Email inválido')
})

export type LoginSchemaType = z.infer<typeof LoginSchema>
export type RegisterSchemaType = z.infer<typeof RegisterSchema>
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>
