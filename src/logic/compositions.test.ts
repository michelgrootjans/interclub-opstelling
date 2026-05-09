import {describe, expect, it} from 'vitest'
import {findSingleCompositions} from './compositions'

describe('findCompositions', () => {
    it('returns no composition when fewer than 4 players are available', () => {
        const players = [
            {name: 'Alice', singles: 60, doubles: 50},
            {name: 'Bob', singles: 45, doubles: 40},
            {name: 'Carol', singles: 20, doubles: 20},
        ]
        expect(findSingleCompositions(players, 999)).toEqual([])
    })

    it('returns no composition when the total exceeds the limit', () => {
        const players = [
            {name: 'Alice', singles: 60, doubles: 50},
            {name: 'Bob', singles: 45, doubles: 40},
            {name: 'Carol', singles: 20, doubles: 20},
            {name: 'Dave', singles: 15, doubles: 15},
        ]
        expect(findSingleCompositions(players, 139)).toEqual([])
    })

    it('returns all combinations of 4 when more than 4 players are available', () => {
        const players = [
            {name: 'Alice', singles: 60, doubles: 50},
            {name: 'Bob', singles: 45, doubles: 40},
            {name: 'Carol', singles: 20, doubles: 20},
            {name: 'Dave', singles: 15, doubles: 15},
            {name: 'Eve', singles: 10, doubles: 10},
        ]
        const result = findSingleCompositions(players, 999)
        expect(result).toHaveLength(5)
        result.forEach(c => expect(c.players).toHaveLength(4))
    })

    it('returns one composition with the actual players passed in', () => {
        const players = [
            {name: 'Eve', singles: 55, doubles: 30},
            {name: 'Frank', singles: 40, doubles: 35},
            {name: 'Grace', singles: 25, doubles: 20},
            {name: 'Hank', singles: 10, doubles: 10},
        ]
        expect(findSingleCompositions(players, 999)).toMatchObject([{
            total: 55 + 40 + 25 + 10,
            players,
        }])
    })

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
