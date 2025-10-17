import z from 'zod'

export const PostSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(100, 'Máximo de 100 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres').max(5000, 'Máximo de 5000 caracteres')
})

export type PostSchemaType = z.infer<typeof PostSchema>
