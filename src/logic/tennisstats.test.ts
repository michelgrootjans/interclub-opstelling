import { describe, expect, it } from 'vitest'
import { mapSuggestion, mapMemberDetails } from './tennisstats'

describe('mapSuggestion', () => {
  it('maps all fields from the api response', () => {
    const raw = { id: '42', name: 'BORG Bjorn', name_club: 'TC Leuven', singles: 140 }
    expect(mapSuggestion(raw)).toEqual({ id: '42', name: 'Bjorn BORG', club: 'TC Leuven', singles: 140 })
  })

  it('defaults missing fields to empty/zero', () => {
    expect(mapSuggestion({})).toEqual({ id: '', name: '', club: '', singles: 0 })
  })
})

describe('mapMemberDetails', () => {
  it('extracts singles and doubles current rank', () => {
    const raw = { singles: { current_rank: 120 }, doubles: { current_rank: 95 } }
    expect(mapMemberDetails(raw)).toEqual({ singles: 120, doubles: 95 })
  })

  it('defaults missing ranks to zero', () => {
    expect(mapMemberDetails({ singles: {}, doubles: {} })).toEqual({ singles: 0, doubles: 0 })
  })
})
