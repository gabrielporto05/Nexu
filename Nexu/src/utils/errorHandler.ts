export const getErrorMessage = (err: any, fallbackMessage: string = 'Erro inesperado. Tente novamente.'): string => {
  return err?.response?.data?.data?.error || err?.response?.data?.message || fallbackMessage
}
