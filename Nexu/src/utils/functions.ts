export const capitalize = (str: string): string => {
  if (!str?.trim()) return str || ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
