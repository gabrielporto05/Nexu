import { capitalize } from 'src/utils/functions'

export const getErrorMessage = (err: any, fallbackMessage: string = 'Erro inesperado. Tente novamente.'): string => {
  const message = err?.response?.data?.data?.error || err?.response?.data?.message || fallbackMessage

  return capitalize(message)
}
