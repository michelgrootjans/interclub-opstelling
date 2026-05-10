export function formatName(apiName: string): string {
  const words = apiName.trim().split(' ')
  if (words.length < 2) return apiName
  return `${words[words.length - 1]} ${words.slice(0, -1).join(' ')}`
}
