import {
  isRequired,
  hasMinLength,
  hasMaxLength,
  isValidName,
  isValidStreetAddress,
  isValidEmail,
  isValidUSPhone,
  isValidInternationalPhone,
  isBirthDateMinimumAge,
  isValidUSState,
  isValidCanadianProvince,
  isValidUSZipCode,
  isValidCanadianPostalCode,
  isEqual,
  isOneOf,
  isInteger,
  isDecimal,
  isInRange,
  greaterThanOrEqual,
  lessThanOrEqual,
  isStrongPassword,
  isValidCreditCard,
  isValidCreditCardExpiry,
  isValidCVV,
  isSameAs,
  isAlphaOnly,
  isNumericOnly,
  isValidURL,
  matchesPattern,
  isWithinLastYear,
  areDateFieldsPaired,
  isValidHexColor,
  isValidTime,
  isRequiredIf,
  isInTheFuture,
  isAsciiAlphanumeric,
} from '../src/validators';

describe('Basic Validators', () => {
  describe('isRequired', () => {
    test('returns false for null, undefined, empty string', () => {
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
    });

    test('returns true for valid values', () => {
      expect(isRequired('test')).toBe(true);
      expect(isRequired(0)).toBe(true);
      expect(isRequired(false)).toBe(true);
      expect(isRequired(['item'])).toBe(true);
    });
  });

  describe('hasMinLength', () => {
    test('validates minimum length correctly', () => {
      const validator = hasMinLength(5);
      expect(validator('')).toBe(true); // Empty values skip validation
      expect(validator('test')).toBe(false);
      expect(validator('testing')).toBe(true);
    });
  });

  describe('hasMaxLength', () => {
    test('validates maximum length correctly', () => {
      const validator = hasMaxLength(5);
      expect(validator('')).toBe(true); // Empty values skip validation
      expect(validator('test')).toBe(true);
      expect(validator('testing')).toBe(false);
    });
  });
});

describe('String Pattern Validators', () => {
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

    test('should return true for empty string', () => {
      expect(isAsciiAlphanumeric('')).toBe(true);
    });

    test('should return false for international/accented characters', () => {
      expect(isAsciiAlphanumeric('café')).toBe(false);
      expect(isAsciiAlphanumeric('naïve')).toBe(false);
      expect(isAsciiAlphanumeric('こんにちは')).toBe(false);
      expect(isAsciiAlphanumeric('مرحبا')).toBe(false);
    });
  });

  describe('isAlphaOnly', () => {
    test('validates alphabetic characters only', () => {
      expect(isAlphaOnly('abc')).toBe(true);
      expect(isAlphaOnly('ABC')).toBe(true);
      expect(isAlphaOnly('abc123')).toBe(false);
      expect(isAlphaOnly('')).toBe(true);
    });
  });

  describe('isNumericOnly', () => {
    test('validates numeric characters only', () => {
      expect(isNumericOnly('123')).toBe(true);
      expect(isNumericOnly('abc')).toBe(false);
      expect(isNumericOnly('123abc')).toBe(false);
      expect(isNumericOnly('')).toBe(true);
    });
  });

  describe('matchesPattern', () => {
    test('validates against custom patterns', () => {
      const validator = matchesPattern(/^\d{3}-\d{2}-\d{4}$/);
      expect(validator('123-45-6789')).toBe(true);
      expect(validator('123456789')).toBe(false);
      expect(validator('')).toBe(true);
    });
  });
});

describe('Name Validators', () => {
  describe('isValidName', () => {
    test('accepts valid names', () => {
      expect(isValidName('John')).toBe(true);
      expect(isValidName('Mary-Jane')).toBe(true);
      expect(isValidName("O'Connor")).toBe(true);
      expect(isValidName('Van Der Berg')).toBe(true);
      expect(isValidName('')).toBe(true);
    });

    test('rejects invalid characters', () => {
      expect(isValidName('John123')).toBe(false);
      expect(isValidName('John@Doe')).toBe(false);
      expect(isValidName('John.Doe')).toBe(false);
    });
  });
});

describe('Email Validators', () => {
  describe('isValidEmail', () => {
    test('accepts valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('')).toBe(true);
    });

    test('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
    });
  });
});

describe('URL Validators', () => {
  describe('isValidURL', () => {
    test('validates URLs correctly', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://localhost:3000')).toBe(true);
      expect(isValidURL('invalid-url')).toBe(false);
      expect(isValidURL('')).toBe(true);
    });
  });
});

describe('Phone Validators', () => {
  describe('isValidUSPhone', () => {
    test('accepts valid US phone numbers', () => {
      expect(isValidUSPhone('5551234567')).toBe(true);
      expect(isValidUSPhone('15551234567')).toBe(true);
      expect(isValidUSPhone('(555) 123-4567')).toBe(true);
      expect(isValidUSPhone('')).toBe(true);
    });

    test('rejects invalid US phone numbers', () => {
      expect(isValidUSPhone('555123456')).toBe(false);
      expect(isValidUSPhone('25551234567')).toBe(false);
      expect(isValidUSPhone('abc1234567')).toBe(false);
    });
  });

  describe('isValidInternationalPhone', () => {
    test('accepts valid international phone numbers', () => {
      expect(isValidInternationalPhone('1234567')).toBe(true);
      expect(isValidInternationalPhone('123456789012345')).toBe(true);
      expect(isValidInternationalPhone('+44 20 7946 0958')).toBe(true);
      expect(isValidInternationalPhone('')).toBe(true);
    });

    test('rejects invalid international phone numbers', () => {
      expect(isValidInternationalPhone('123456')).toBe(false);
      expect(isValidInternationalPhone('1234567890123456')).toBe(false);
    });
  });
});

describe('Date & Time Validators', () => {
  describe('isBirthDateMinimumAge', () => {
    test('validates birth date for minimum age', () => {
      const validator = isBirthDateMinimumAge(18);
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      
      expect(validator(eighteenYearsAgo)).toBe(true);
      expect(validator(new Date())).toBe(false);
      expect(validator('')).toBe(true);
    });
  });

  describe('isWithinLastYear', () => {
    test('should return true for dates within the last year', () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      expect(isWithinLastYear(sixMonthsAgo.toISOString())).toBe(true);

      const today = new Date();
      expect(isWithinLastYear(today.toISOString())).toBe(true);
    });

    test('should return false for dates older than one year', () => {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      expect(isWithinLastYear(twoYearsAgo.toISOString())).toBe(false);
    });

    test('should return true for empty or null dates', () => {
      expect(isWithinLastYear('')).toBe(true);
      expect(isWithinLastYear(null)).toBe(true);
      expect(isWithinLastYear(undefined)).toBe(true);
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

    test('should handle string date formats', () => {
      const futureDate = '2030-12-31T23:59:59Z';
      const pastDate = '2020-01-01T00:00:00Z';
      
      expect(isInTheFuture(futureDate)).toBe(true);
      expect(isInTheFuture(pastDate)).toBe(false);
    });
  });

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
  });

  describe('isValidTime', () => {
    test('validates time formats correctly', () => {
      expect(isValidTime('09:30')).toBe(true);
      expect(isValidTime('9:30')).toBe(true);
      expect(isValidTime('23:59')).toBe(true);
      expect(isValidTime('00:00')).toBe(true);
      expect(isValidTime('12:30:45')).toBe(true);
      expect(isValidTime('')).toBe(true);
    });

    test('rejects invalid time formats', () => {
      expect(isValidTime('25:00')).toBe(false);
      expect(isValidTime('12:60')).toBe(false);
      expect(isValidTime('12:30:60')).toBe(false);
      expect(isValidTime('12:5')).toBe(false);
      expect(isValidTime('abc:30')).toBe(false);
    });
  });
});

describe('Address Validators', () => {
  describe('isValidStreetAddress', () => {
    test('accepts valid street addresses', () => {
      expect(isValidStreetAddress('123 Main St')).toBe(true);
      expect(isValidStreetAddress('456 Oak Ave, Apt 2B')).toBe(true);
      expect(isValidStreetAddress('')).toBe(true);
    });

    test('rejects invalid street addresses', () => {
      expect(isValidStreetAddress('123 Main St @#$%')).toBe(false);
    });
  });

  describe('isValidUSState', () => {
    test('accepts valid US state codes', () => {
      expect(isValidUSState('CA')).toBe(true);
      expect(isValidUSState('NY')).toBe(true);
      expect(isValidUSState('DC')).toBe(true);
      expect(isValidUSState('ca')).toBe(true);
      expect(isValidUSState('')).toBe(true);
    });

    test('rejects invalid US state codes', () => {
      expect(isValidUSState('XX')).toBe(false);
      expect(isValidUSState('California')).toBe(false);
    });
  });

  describe('isValidCanadianProvince', () => {
    test('accepts valid Canadian province codes', () => {
      expect(isValidCanadianProvince('ON')).toBe(true);
      expect(isValidCanadianProvince('BC')).toBe(true);
      expect(isValidCanadianProvince('QC')).toBe(true);
      expect(isValidCanadianProvince('')).toBe(true);
    });

    test('rejects invalid Canadian province codes', () => {
      expect(isValidCanadianProvince('XX')).toBe(false);
      expect(isValidCanadianProvince('Ontario')).toBe(false);
    });
  });

  describe('isValidUSZipCode', () => {
    test('accepts valid US ZIP codes', () => {
      expect(isValidUSZipCode('12345')).toBe(true);
      expect(isValidUSZipCode('12345-6789')).toBe(true);
      expect(isValidUSZipCode('')).toBe(true);
    });

    test('rejects invalid US ZIP codes', () => {
      expect(isValidUSZipCode('1234')).toBe(false);
      expect(isValidUSZipCode('123456')).toBe(false);
      expect(isValidUSZipCode('abcde')).toBe(false);
    });
  });

  describe('isValidCanadianPostalCode', () => {
    test('accepts valid Canadian postal codes', () => {
      expect(isValidCanadianPostalCode('K1A 0A6')).toBe(true);
      expect(isValidCanadianPostalCode('M5V 3A8')).toBe(true);
      expect(isValidCanadianPostalCode('')).toBe(true);
    });

    test('rejects invalid Canadian postal codes', () => {
      expect(isValidCanadianPostalCode('K1A0A6')).toBe(false);
      expect(isValidCanadianPostalCode('K1A 0A')).toBe(false);
      expect(isValidCanadianPostalCode('12A 3B4')).toBe(false);
    });
  });
});

describe('Numeric Validators', () => {
  describe('isInteger', () => {
    test('validates integers correctly', () => {
      expect(isInteger(5)).toBe(true);
      expect(isInteger('10')).toBe(true);
      expect(isInteger(5.5)).toBe(false);
      expect(isInteger('5.5')).toBe(false);
      expect(isInteger('')).toBe(true);
    });
  });

  describe('isDecimal', () => {
    test('validates decimal numbers correctly', () => {
      expect(isDecimal(5)).toBe(true);
      expect(isDecimal(5.5)).toBe(true);
      expect(isDecimal('10.25')).toBe(true);
      expect(isDecimal('abc')).toBe(false);
      expect(isDecimal('')).toBe(true);
    });
  });

  describe('isInRange', () => {
    test('validates range correctly', () => {
      const validator = isInRange(1, 10);
      expect(validator(5)).toBe(true);
      expect(validator(1)).toBe(true);
      expect(validator(10)).toBe(true);
      expect(validator(0)).toBe(false);
      expect(validator(11)).toBe(false);
      expect(validator('')).toBe(true);
    });
  });

  describe('greaterThanOrEqual', () => {
    test('validates minimum value correctly', () => {
      const validator = greaterThanOrEqual(18);
      expect(validator(18)).toBe(true);
      expect(validator(25)).toBe(true);
      expect(validator(17)).toBe(false);
      expect(validator('')).toBe(true);
    });
  });

  describe('lessThanOrEqual', () => {
    test('validates maximum value correctly', () => {
      const validator = lessThanOrEqual(150);
      expect(validator(25)).toBe(true);
      expect(validator(150)).toBe(true);
      expect(validator(151)).toBe(false);
      expect(validator('')).toBe(true);
    });
  });
});

describe('Password Validators', () => {
  describe('isStrongPassword', () => {
    test('validates with default options', () => {
      const validator = isStrongPassword();
      expect(validator('Password123')).toBe(true);
      expect(validator('password')).toBe(false);
      expect(validator('PASSWORD')).toBe(false);
      expect(validator('Pass123')).toBe(false);
      expect(validator('')).toBe(true);
    });

    test('validates with custom options', () => {
      const validator = isStrongPassword({
        minLength: 6,
        requireUppercase: false,
        requireSymbols: true
      });
      expect(validator('pass123!')).toBe(true);
      expect(validator('pass123')).toBe(false);
    });
  });
});

describe('Credit Card Validators', () => {
  describe('isValidCreditCard', () => {
    test('validates valid credit card numbers', () => {
      expect(isValidCreditCard('4532015112830366')).toBe(true);
      expect(isValidCreditCard('4532-0151-1283-0366')).toBe(true);
      expect(isValidCreditCard('')).toBe(true);
    });

    test('rejects invalid credit card numbers', () => {
      expect(isValidCreditCard('1234567890123456')).toBe(false);
      expect(isValidCreditCard('123')).toBe(false);
    });
  });

  describe('isValidCreditCardExpiry', () => {
    test('validates valid expiry dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const month = String(futureDate.getMonth() + 1).padStart(2, '0');
      const year = String(futureDate.getFullYear()).slice(-2);
      
      expect(isValidCreditCardExpiry(`${month}${year}`)).toBe(true);
      expect(isValidCreditCardExpiry('')).toBe(true);
    });

    test('rejects invalid expiry dates', () => {
      expect(isValidCreditCardExpiry('1320')).toBe(false);
      expect(isValidCreditCardExpiry('0120')).toBe(false);
    });
  });

  describe('isValidCVV', () => {
    test('validates valid CVV codes', () => {
      expect(isValidCVV('123')).toBe(true);
      expect(isValidCVV('1234')).toBe(true);
      expect(isValidCVV('')).toBe(true);
    });

    test('rejects invalid CVV codes', () => {
      expect(isValidCVV('12')).toBe(false);
      expect(isValidCVV('12345')).toBe(false);
      expect(isValidCVV('abc')).toBe(false);
    });
  });
});

describe('Color Validators', () => {
  describe('isValidHexColor', () => {
    test('validates hex color codes correctly', () => {
      expect(isValidHexColor('#FF0000')).toBe(true);
      expect(isValidHexColor('#f00')).toBe(true);
      expect(isValidHexColor('#123ABC')).toBe(true);
      expect(isValidHexColor('')).toBe(true);
    });

    test('rejects invalid hex color codes', () => {
      expect(isValidHexColor('FF0000')).toBe(false);
      expect(isValidHexColor('#GG0000')).toBe(false);
      expect(isValidHexColor('#FF00')).toBe(false);
      expect(isValidHexColor('#FF00000')).toBe(false);
    });
  });
});

describe('Comparison Validators', () => {
  describe('isEqual', () => {
    test('validates equality correctly', () => {
      const validator = isEqual('test');
      expect(validator('test')).toBe(true);
      expect(validator('other')).toBe(false);
      expect(validator(null)).toBe(false);
      expect(validator(undefined)).toBe(false);
    });

    test('handles null/undefined comparisons', () => {
      const nullValidator = isEqual(null);
      expect(nullValidator(null)).toBe(true);
      expect(nullValidator(undefined)).toBe(true);
      expect(nullValidator('test')).toBe(false);
    });
  });

  describe('isOneOf', () => {
    test('validates allowed values correctly', () => {
      const validator = isOneOf(['red', 'green', 'blue']);
      expect(validator('red')).toBe(true);
      expect(validator('yellow')).toBe(false);
      expect(validator('')).toBe(true);
    });
  });

  describe('isSameAs', () => {
    test('validates field matching correctly', () => {
      const validator = isSameAs('password123');
      expect(validator('password123')).toBe(true);
      expect(validator('different')).toBe(false);
      expect(validator('')).toBe(true);
    });
  });
});

describe('Conditional Validators', () => {
  describe('isRequiredIf', () => {
    test('validates conditionally required fields', () => {
      const requiredValidator = isRequiredIf(true);
      const notRequiredValidator = isRequiredIf(false);
      
      expect(requiredValidator('test')).toBe(true);
      expect(requiredValidator('')).toBe(false);
      expect(requiredValidator(null)).toBe(false);
      
      expect(notRequiredValidator('test')).toBe(true);
      expect(notRequiredValidator('')).toBe(true);
      expect(notRequiredValidator(null)).toBe(true);
    });
  });
});
