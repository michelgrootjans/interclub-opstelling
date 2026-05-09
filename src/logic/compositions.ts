type Player = {
  name: string
  singles: number
  doubles: number
}

type SinglesComposition = {
  total: number
  players: Player[]
}

export function findSingleCompositions(players: Player[], limit: number): SinglesComposition[] {
  if(players.length < 4) return []
  const total = players.reduce((sum, player) => sum + player.singles, 0);

  if(total > limit) return []

  return [{
    total: total,
    players: players
  }
  ]
}
