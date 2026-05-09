type Player = {
  name: string
  singles: number
  doubles: number
}

type SinglesComposition = {
  total: number
  players: Player[]
}

export function findSingleCompositions(players: Player[], _limit: number): SinglesComposition[] {
  if(players.length < 4) return []

  return [{
    total: players.reduce((sum, player) => sum + player.singles, 0),
    players: players
  }
  ]
}
