import { encodePathSegment, escapeXml, toSafeJsonLd } from '@/lib/security'

describe('security helpers', () => {
  describe('encodePathSegment', () => {
    it('encodes reserved path characters', () => {
      expect(encodePathSegment('../test slug')).toBe('..%2Ftest%20slug')
      expect(encodePathSegment('a/b?c=d')).toBe('a%2Fb%3Fc%3Dd')
    })
  })

  describe('escapeXml', () => {
    it('escapes xml-sensitive characters', () => {
      expect(escapeXml(`<&>"'`)).toBe('&lt;&amp;&gt;&quot;&apos;')
    })

    it('does not alter safe text', () => {
      expect(escapeXml('Safe text 123')).toBe('Safe text 123')
    })
  })

  describe('toSafeJsonLd', () => {
    it('escapes html-dangerous and line-separator characters', () => {
      const result = toSafeJsonLd({
        text: '<script>&</script>',
        line: 'before\u2028after\u2029done',
      })

      expect(result).toContain('\\u003cscript\\u003e\\u0026\\u003c/script\\u003e')
      expect(result).toContain('\\u2028')
      expect(result).toContain('\\u2029')
      expect(result).not.toContain('<script>')
    })
  })
})
