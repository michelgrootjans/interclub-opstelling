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

export type Slot = { ranking: number; names: string[] }
export type MergedComposition = { total: number; slots: Slot[] }

export function groupCompositions(
  compositions: Composition[],
  ranking: (p: Player) => number
): MergedComposition[] {
  const groups = new Map<string, MergedComposition>()
  for (const comp of compositions) {
    const sorted = [...comp.players].sort((a, b) => ranking(b) - ranking(a))
    const key = `${comp.total}_${sorted.map(p => ranking(p)).join('_')}`
    if (!groups.has(key)) {
      groups.set(key, { total: comp.total, slots: sorted.map(p => ({ ranking: ranking(p), names: [p.name] })) })
    } else {
      sorted.forEach((p, i) => {
        const slot = groups.get(key)!.slots[i]
        if (!slot.names.includes(p.name)) slot.names.push(p.name)
      })
    }
  }
  return [...groups.values()]
}
