export const getErrorMessage = (err, fallbackMessage: string = 'Erro inesperado. Tente novamente.'): string => {
  return err?.response?.data?.data?.error || err?.response?.data?.message || fallbackMessage
}
