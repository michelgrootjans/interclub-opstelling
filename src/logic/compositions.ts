type Player = {
  name: string
  singles: number
  doubles: number
}

type SinglesComposition = {
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

export function findSingleCompositions(players: Player[], limit: number): SinglesComposition[] {
  return combinations(players, 4)
    .map(group => ({ total: group.reduce((sum, p) => sum + p.singles, 0), players: group }))
    .filter(c => c.total <= limit)
}
