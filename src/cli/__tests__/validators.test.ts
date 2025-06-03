import { describe, expect, it } from 'vitest'
import { validDomainName } from '../validators'

describe('validDomainName', () => {
  it('accepts valid domains', () => {
    const validSamples = ['example.com', 'foo.example.co.uk', 'my-site.io']
    for (const sample of validSamples) {
      expect(validDomainName(sample)).toBe(true)
    }
  })

  it('rejects invalid domains', () => {
    const invalidSamples = ['', 'foo..com', '-start.com', 'exa_mple.com', '*.example.com']
    for (const sample of invalidSamples) {
      expect(validDomainName(sample)).toBeFalsy()
    }
  })
})
