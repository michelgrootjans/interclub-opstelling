import {describe, expect, it} from 'vitest'
import {findSingleCompositions} from './compositions'

describe('findCompositions', () => {
    it('returns one composition when exactly 4 players are available within the limit', () => {
        const players = [
            {name: 'Alice', singles: 60, doubles: 50},
            {name: 'Bob', singles: 45, doubles: 40},
            {name: 'Carol', singles: 20, doubles: 20},
            {name: 'Dave', singles: 15, doubles: 15},
        ]
        expect(findSingleCompositions(players, 140)).toMatchObject([{
            total: 60 + 45 + 20 + 15,
            players: [
                {name: 'Alice', singles: 60, doubles: 50},
                {name: 'Bob', singles: 45, doubles: 40},
                {name: 'Carol', singles: 20, doubles: 20},
                {name: 'Dave', singles: 15, doubles: 15},
            ]
        }])
    })
})
