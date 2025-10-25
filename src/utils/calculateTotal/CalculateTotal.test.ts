import { describe, it, expect } from 'vitest'
import { calculateTotal } from './CalculateTotal'

describe('calculateTotal', () => {
  describe('basic functionality', () => {
    it('should calculate total from comma-separated values', () => {
      expect(calculateTotal('10,20,30')).toBe(60)
    })

    it('should calculate total from newline-separated values', () => {
      expect(calculateTotal('10\n20\n30')).toBe(60)
    })

    it('should calculate total from mixed separators', () => {
      expect(calculateTotal('10,20\n30,40')).toBe(100)
    })

    it('should handle single value', () => {
      expect(calculateTotal('42')).toBe(42)
    })
  })

  describe('whitespace handling', () => {
    it('should trim whitespace around values', () => {
      expect(calculateTotal('  10  ,  20  ,  30  ')).toBe(60)
    })

    it('should handle values with spaces and newlines', () => {
      expect(calculateTotal('10 \n 20 \n 30')).toBe(60)
    })

    it('should filter out empty strings', () => {
      expect(calculateTotal('10,,20,,,30')).toBe(60)
    })

    it('should handle multiple consecutive newlines', () => {
      expect(calculateTotal('10\n\n\n20\n30')).toBe(60)
    })
  })

  describe('decimal numbers', () => {
    it('should handle decimal values', () => {
      expect(calculateTotal('10.5,20.3,30.2')).toBe(61)
    })

    it('should handle very small decimals', () => {
      expect(calculateTotal('0.1,0.2,0.3')).toBeCloseTo(0.6, 5)
    })

    it('should handle mixed integers and decimals', () => {
      expect(calculateTotal('10,20.5,30')).toBe(60.5)
    })
  })

  describe('edge cases', () => {
    it('should return 0 for empty string', () => {
      expect(calculateTotal('')).toBe(0)
    })

    it('should return 0 for whitespace only', () => {
      expect(calculateTotal('   \n  \n  ')).toBe(0)
    })

    it('should return 0 when any value is NaN', () => {
      expect(calculateTotal('10,abc,30')).toBe(0)
    })

    it('should return 0 when first value is invalid', () => {
      expect(calculateTotal('invalid,20,30')).toBe(0)
    })

    it('should return 0 when last value is invalid', () => {
      expect(calculateTotal('10,20,invalid')).toBe(0)
    })

    it('should return 0 for all invalid values', () => {
      expect(calculateTotal('abc,def,ghi')).toBe(0)
    })

    it('should handle zero values', () => {
      expect(calculateTotal('0,0,0')).toBe(0)
    })

    it('should handle negative numbers', () => {
      expect(calculateTotal('10,-5,15')).toBe(20)
    })

    it('should handle mix of positive and negative', () => {
      expect(calculateTotal('-10,20,-5,15')).toBe(20)
    })
  })

  describe('large numbers', () => {
    it('should handle large numbers', () => {
      expect(calculateTotal('1000000,2000000,3000000')).toBe(6000000)
    })

    it('should handle very large token amounts (like 18 decimals)', () => {
      const amount = '1000000000000000000' // 1 token with 18 decimals
      expect(calculateTotal(`${amount},${amount}`)).toBe(2000000000000000000)
    })
  })

  describe('real-world airdrop scenarios', () => {
    it('should handle typical airdrop input format', () => {
      const input = `100
200
300
400
500`
      expect(calculateTotal(input)).toBe(1500)
    })

    it('should handle airdrop with decimals', () => {
      const input = `100.5
200.25
300.75`
      expect(calculateTotal(input)).toBe(601.5)
    })

    it('should handle mixed format from copy-paste', () => {
      const input = '100, 200, 300\n400\n500,600'
      expect(calculateTotal(input)).toBe(2100)
    })
  })

  describe('special number formats', () => {
    it('should handle numbers with leading zeros', () => {
      expect(calculateTotal('010,020,030')).toBe(60)
    })

    it('should handle scientific notation', () => {
      expect(calculateTotal('1e2,2e2,3e2')).toBe(600)
    })

    it('should return 0 for invalid special characters', () => {
      expect(calculateTotal('10$,20€,30')).toBe(0)
    })
  })
})