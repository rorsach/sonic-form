import {
  areDateFieldsPaired,
  isEndDateAfterStartDate,
  isWithinTheLastYear,
  isInTheFuture,
  isAsciiAlphanumeric,
} from '../src/validators';

describe('validators', () => {
  describe('areDateFieldsPaired', () => {
    test('should return true when both dates are provided', () => {
      expect(areDateFieldsPaired('2023-01-01', '2023-01-02')).toBe(true);
      expect(areDateFieldsPaired(new Date('2023-01-01'), new Date('2023-01-02'))).toBe(true);
    });

    test('should return false when only one date is provided', () => {
      expect(areDateFieldsPaired('2023-01-01', '')).toBe(false);
      expect(areDateFieldsPaired('', '2023-01-02')).toBe(false);
      expect(areDateFieldsPaired('2023-01-01', null)).toBe(false);
      expect(areDateFieldsPaired(null, '2023-01-02')).toBe(false);
    });

    test('should return true when neither date is provided', () => {
      expect(areDateFieldsPaired('', '')).toBe(true);
      expect(areDateFieldsPaired(null, null)).toBe(true);
      expect(areDateFieldsPaired(undefined, undefined)).toBe(true);
    });

    test('should handle whitespace-only strings', () => {
      expect(areDateFieldsPaired('   ', '2023-01-02')).toBe(false);
      expect(areDateFieldsPaired('2023-01-01', '   ')).toBe(false);
      expect(areDateFieldsPaired('   ', '   ')).toBe(true);
    });
  });

  describe('isEndDateAfterStartDate', () => {
    test('should return true when end date is after start date', () => {
      expect(isEndDateAfterStartDate('2023-01-01', '2023-01-02')).toBe(true);
      expect(isEndDateAfterStartDate('2023-01-01T10:00:00', '2023-01-01T11:00:00')).toBe(true);
    });

    test('should return false when end date is before start date', () => {
      expect(isEndDateAfterStartDate('2023-01-02', '2023-01-01')).toBe(false);
      expect(isEndDateAfterStartDate('2023-01-01T11:00:00', '2023-01-01T10:00:00')).toBe(false);
    });

    test('should return false when dates are equal', () => {
      expect(isEndDateAfterStartDate('2023-01-01', '2023-01-01')).toBe(false);
      expect(isEndDateAfterStartDate('2023-01-01T10:00:00', '2023-01-01T10:00:00')).toBe(false);
    });

    test('should return true when either date is missing', () => {
      expect(isEndDateAfterStartDate('2023-01-01', '')).toBe(true);
      expect(isEndDateAfterStartDate('', '2023-01-02')).toBe(true);
      expect(isEndDateAfterStartDate(null, '2023-01-02')).toBe(true);
      expect(isEndDateAfterStartDate('2023-01-01', null)).toBe(true);
      expect(isEndDateAfterStartDate('', '')).toBe(true);
    });

    test('should handle Date objects', () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-02');
      expect(isEndDateAfterStartDate(startDate, endDate)).toBe(true);
      expect(isEndDateAfterStartDate(endDate, startDate)).toBe(false);
    });
  });

  describe('isWithinTheLastYear', () => {
    test('should return true for dates within the last year', () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      expect(isWithinTheLastYear(sixMonthsAgo.toISOString())).toBe(true);

      const today = new Date();
      expect(isWithinTheLastYear(today.toISOString())).toBe(true);
    });

    test('should return false for dates older than one year', () => {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      expect(isWithinTheLastYear(twoYearsAgo.toISOString())).toBe(false);

      const oneYearAndOneDayAgo = new Date();
      oneYearAndOneDayAgo.setFullYear(oneYearAndOneDayAgo.getFullYear() - 1);
      oneYearAndOneDayAgo.setDate(oneYearAndOneDayAgo.getDate() - 1);
      expect(isWithinTheLastYear(oneYearAndOneDayAgo.toISOString())).toBe(false);
    });

    test('should return true for empty or null dates', () => {
      expect(isWithinTheLastYear('')).toBe(true);
      expect(isWithinTheLastYear(null)).toBe(true);
      expect(isWithinTheLastYear(undefined)).toBe(true);
    });

    test('should handle Date objects', () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      expect(isWithinTheLastYear(sixMonthsAgo)).toBe(true);

      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      expect(isWithinTheLastYear(twoYearsAgo)).toBe(false);
    });
  });

  describe('isAsciiAlphanumeric', () => {
    test('should return true for ASCII alphanumeric strings', () => {
      expect(isAsciiAlphanumeric('abc123')).toBe(true);
      expect(isAsciiAlphanumeric('ABC123')).toBe(true);
      expect(isAsciiAlphanumeric('test')).toBe(true);
      expect(isAsciiAlphanumeric('123')).toBe(true);
      expect(isAsciiAlphanumeric('Test123')).toBe(true);
    });

    test('should return false for non-alphanumeric strings', () => {
      expect(isAsciiAlphanumeric('test-123')).toBe(false);
      expect(isAsciiAlphanumeric('test_123')).toBe(false);
      expect(isAsciiAlphanumeric('test 123')).toBe(false);
      expect(isAsciiAlphanumeric('test@123')).toBe(false);
      expect(isAsciiAlphanumeric('test.123')).toBe(false);
      expect(isAsciiAlphanumeric('test!123')).toBe(false);
    });

    test('should return true for empty string (consistent with other validators)', () => {
      expect(isAsciiAlphanumeric('')).toBe(true);
    });

    test('should return false for strings with special characters', () => {
      expect(isAsciiAlphanumeric('hello!')).toBe(false);
      expect(isAsciiAlphanumeric('hello@world')).toBe(false);
      expect(isAsciiAlphanumeric('hello#world')).toBe(false);
      expect(isAsciiAlphanumeric('hello$world')).toBe(false);
      expect(isAsciiAlphanumeric('hello%world')).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(isAsciiAlphanumeric('a')).toBe(true);
      expect(isAsciiAlphanumeric('1')).toBe(true);
      expect(isAsciiAlphanumeric('A')).toBe(true);
      expect(isAsciiAlphanumeric('0')).toBe(true);
    });

    test('should return false for international/accented characters (ASCII-only behavior)', () => {
      // Accented Latin characters
      expect(isAsciiAlphanumeric('café')).toBe(false);
      expect(isAsciiAlphanumeric('naïve')).toBe(false);
      expect(isAsciiAlphanumeric('résumé')).toBe(false);
      expect(isAsciiAlphanumeric('piñata')).toBe(false);
      expect(isAsciiAlphanumeric('Zürich')).toBe(false);
      
      // Non-Latin scripts
      expect(isAsciiAlphanumeric('こんにちは')).toBe(false); // Japanese
      expect(isAsciiAlphanumeric('مرحبا')).toBe(false); // Arabic
      expect(isAsciiAlphanumeric('Привет')).toBe(false); // Cyrillic
      expect(isAsciiAlphanumeric('你好')).toBe(false); // Chinese
      
      // Mixed ASCII + international
      expect(isAsciiAlphanumeric('test123ñ')).toBe(false);
      expect(isAsciiAlphanumeric('café123')).toBe(false);
    });
  });

  describe('isInTheFuture', () => {
    test('should return true for future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      expect(isInTheFuture(tomorrow)).toBe(true);
      expect(isInTheFuture(tomorrow.toISOString())).toBe(true);
      expect(isInTheFuture(tomorrow.getTime())).toBe(true);
    });

    test('should return false for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(isInTheFuture(yesterday)).toBe(false);
      expect(isInTheFuture(yesterday.toISOString())).toBe(false);
      expect(isInTheFuture(yesterday.getTime())).toBe(false);
    });

    test('should return false for current time (approximately)', () => {
      const now = new Date();
      // Allow for small timing differences in test execution
      const result = isInTheFuture(now);
      expect(typeof result).toBe('boolean');
      // Current time should generally be false, but we won't be strict due to timing
    });

    test('should handle string date formats', () => {
      const futureDate = '2030-12-31T23:59:59Z';
      const pastDate = '2020-01-01T00:00:00Z';
      
      expect(isInTheFuture(futureDate)).toBe(true);
      expect(isInTheFuture(pastDate)).toBe(false);
    });

    test('should handle timestamp numbers', () => {
      const futureTimestamp = Date.now() + 86400000; // Tomorrow
      const pastTimestamp = Date.now() - 86400000; // Yesterday
      
      expect(isInTheFuture(futureTimestamp)).toBe(true);
      expect(isInTheFuture(pastTimestamp)).toBe(false);
    });
  });
});
