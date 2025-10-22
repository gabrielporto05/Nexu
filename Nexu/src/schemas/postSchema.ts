import z from 'zod'

export const PostSchema = z.object({
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres').max(5000, 'Máximo de 5000 caracteres')
})

export type PostSchemaType = z.infer<typeof PostSchema>
