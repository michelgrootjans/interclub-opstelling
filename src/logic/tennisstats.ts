import { formatName } from './formatName'

export type Suggestion = { id: string; name: string; club: string; singles: number }

export function mapSuggestion(u: Record<string, unknown>): Suggestion {
  return {
    id: String(u['id'] ?? ''),
    name: formatName(String(u['name'] ?? '')),
    club: String(u['name_club'] ?? ''),
    singles: Number(u['singles'] ?? 0),
  }
}

export function mapMemberDetails(data: Record<string, Record<string, unknown>>): { singles: number; doubles: number } {
  return {
    singles: Number(data['singles']?.['current_rank'] ?? 0),
    doubles: Number(data['doubles']?.['current_rank'] ?? 0),
  }
}
