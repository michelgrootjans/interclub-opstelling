import { describe, expect, it } from 'vitest'
import { formatName } from './formatName'

describe('formatName', () => {
  it('puts the first name before the last name', () => {
    expect(formatName('DOE Jane')).toBe('Jane DOE')
  })

  it('handles multi-word last names', () => {
    expect(formatName('VAN DEN BERG Peter')).toBe('Peter VAN DEN BERG')
  })

  it('returns a single-word name unchanged', () => {
    expect(formatName('Smith')).toBe('Smith')
  })
})
