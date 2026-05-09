export type Player = {
  name: string
  singles: number
  doubles: number
}

export type Composition = {
  total: number
  players: Player[]
}

function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]]
  if (arr.length < k) return []
  const [first, ...rest] = arr
  return [
    ...combinations(rest, k - 1).map(c => [first, ...c]),
    ...combinations(rest, k),
  ]
}

function findCompositions(players: Player[], limit: number, ranking: (p: Player) => number): Composition[] {
  return combinations(players, 4)
    .map(group => ({ total: group.reduce((sum, p) => sum + ranking(p), 0), players: group }))
    .filter(c => c.total <= limit)
}

export function findSingleCompositions(players: Player[], limit: number): Composition[] {
  return findCompositions(players, limit, p => p.singles)
}

export function findDoubleCompositions(players: Player[], limit: number): Composition[] {
  return findCompositions(players, limit, p => p.doubles)
}
