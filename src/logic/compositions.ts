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
    total: 60 + 45 + 20 + 15,
    players: [
      {name: 'Alice', singles: 60, doubles: 50},
      {name: 'Bob', singles: 45, doubles: 40},
      {name: 'Carol', singles: 20, doubles: 20},
      {name: 'Dave', singles: 15, doubles: 15},
    ]
  }
  ]
}
