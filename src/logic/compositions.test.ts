import {describe, expect, it} from 'vitest'
import {findSingleCompositions} from './compositions'

const alice_60_50 = {name: 'Alice', singles: 60, doubles: 50}
const bob_45_40   = {name: 'Bob',   singles: 45, doubles: 40}
const carol_20_20 = {name: 'Carol', singles: 20, doubles: 20}
const dave_15_15  = {name: 'Dave',  singles: 15, doubles: 15}
const eve_10_10   = {name: 'Eve',   singles: 10, doubles: 10}
const eve_55_30   = {name: 'Eve',   singles: 55, doubles: 30}
const frank_40_35 = {name: 'Frank', singles: 40, doubles: 35}
const grace_25_20 = {name: 'Grace', singles: 25, doubles: 20}
const hank_10_10  = {name: 'Hank',  singles: 10, doubles: 10}

describe('findCompositions', () => {
    it('returns no composition when fewer than 4 players are available', () => {
        const players = [alice_60_50, bob_45_40, carol_20_20]
        expect(findSingleCompositions(players, 999)).toEqual([])
    })

    it('returns no composition when the total exceeds the limit', () => {
        const players = [alice_60_50, bob_45_40, carol_20_20, dave_15_15]
        expect(findSingleCompositions(players, 139)).toEqual([])
    })

    it('returns all combinations of 4 when more than 4 players are available', () => {
        const players = [alice_60_50, bob_45_40, carol_20_20, dave_15_15, eve_10_10]
        expect(findSingleCompositions(players, 999)).toMatchObject([
            {total: 140, players: [alice_60_50, bob_45_40, carol_20_20, dave_15_15]},
            {total: 135, players: [alice_60_50, bob_45_40, carol_20_20, eve_10_10]},
            {total: 130, players: [alice_60_50, bob_45_40, dave_15_15,  eve_10_10]},
            {total: 105, players: [alice_60_50, carol_20_20, dave_15_15, eve_10_10]},
            {total:  90, players: [bob_45_40,   carol_20_20, dave_15_15, eve_10_10]},
        ])
    })

    it('returns one composition with the actual players passed in', () => {
        const players = [eve_55_30, frank_40_35, grace_25_20, hank_10_10]
        expect(findSingleCompositions(players, 999)).toMatchObject([{
            total: 55 + 40 + 25 + 10,
            players,
        }])
    })

    it('returns one composition when exactly 4 players are available within the limit', () => {
        const players = [alice_60_50, bob_45_40, carol_20_20, dave_15_15]
        expect(findSingleCompositions(players, 140)).toMatchObject([{
            total: 60 + 45 + 20 + 15,
            players,
        }])
    })
})
