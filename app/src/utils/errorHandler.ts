export const getErrorMessage = (error: any, fallbackMessage: string = 'Erro inesperado. Tente novamente.'): string => {
  return error?.response?.data?.data?.error || error?.response?.data?.message || fallbackMessage
}
