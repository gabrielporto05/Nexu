import z from 'zod'

export const ChangePasswordSchema = z.object({
  current_password: z.string().min(6, 'Senha atual deve ter ao menos 6 caracteres'),
  new_password: z
    .string()
    .min(8, 'A nova senha deve ter ao menos 8 caracteres')
    .regex(/[A-Z]/, 'A nova senha deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'A nova senha deve conter ao menos uma letra minúscula')
    .regex(/\d/, 'A nova senha deve conter ao menos um número')
})

export type ChangePasswordSchemaType = z.infer<typeof ChangePasswordSchema>
