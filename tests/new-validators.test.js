import {
  isRequired,
  hasMinLength,
  hasMaxLength,
  isValidName,
  isValidEmail,
  isValidUSPhone,
  isValidInternationalPhone,
  isValidAge,
  isMinimumAge,
  isBirthDateMinimumAge,
  isValidStreetAddress,
  isValidCity,
  isValidUSState,
  isValidCanadianProvince,
  isValidUSZipCode,
  isValidCanadianPostalCode,
  isEqual,
  isOneOf,
  isInteger,
  isDecimal,
  isInRange,
  isStrongPassword,
  isValidCreditCard,
  isValidCreditCardExpiry,
  isValidCVV,
  isSameAs,
  isAlphaOnly,
  isNumericOnly,
  isValidURL,
  matchesPattern,
  isWithinTheLastYear,
  areDateFieldsPaired,
  isValidHexColor,
  isValidTime,
  isRequiredIf,
  isInTheFuture
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

describe('Name Validators', () => {
  describe('isValidName', () => {
    test('accepts valid names', () => {
      expect(isValidName('John')).toBe(true);
      expect(isValidName('Mary-Jane')).toBe(true);
      expect(isValidName("O'Connor")).toBe(true);
      expect(isValidName('Van Der Berg')).toBe(true);
      expect(isValidName('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid names', () => {
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
      expect(isValidEmail('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
    });
  });
});

describe('Phone Validators', () => {
  describe('isValidUSPhone', () => {
    test('accepts valid US phone numbers', () => {
      expect(isValidUSPhone('5551234567')).toBe(true);
      expect(isValidUSPhone('15551234567')).toBe(true);
      expect(isValidUSPhone('(555) 123-4567')).toBe(true);
      expect(isValidUSPhone('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid US phone numbers', () => {
      expect(isValidUSPhone('555123456')).toBe(false); // Too short
      expect(isValidUSPhone('25551234567')).toBe(false); // Wrong country code
      expect(isValidUSPhone('abc1234567')).toBe(false); // Contains letters
    });
  });

  describe('isValidInternationalPhone', () => {
    test('accepts valid international phone numbers', () => {
      expect(isValidInternationalPhone('1234567')).toBe(true); // 7 digits
      expect(isValidInternationalPhone('123456789012345')).toBe(true); // 15 digits
      expect(isValidInternationalPhone('+44 20 7946 0958')).toBe(true);
      expect(isValidInternationalPhone('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid international phone numbers', () => {
      expect(isValidInternationalPhone('123456')).toBe(false); // Too short
      expect(isValidInternationalPhone('1234567890123456')).toBe(false); // Too long
    });
  });
});

describe('Age Validators', () => {
  describe('isValidAge', () => {
    test('accepts valid ages', () => {
      expect(isValidAge(25)).toBe(true);
      expect(isValidAge('30')).toBe(true);
      expect(isValidAge(0)).toBe(true);
      expect(isValidAge(150)).toBe(true);
      expect(isValidAge('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid ages', () => {
      expect(isValidAge(-1)).toBe(false);
      expect(isValidAge(151)).toBe(false);
      expect(isValidAge('abc')).toBe(false);
    });
  });

  describe('isMinimumAge', () => {
    test('validates minimum age correctly', () => {
      const validator = isMinimumAge(18);
      expect(validator(18)).toBe(true);
      expect(validator(25)).toBe(true);
      expect(validator(17)).toBe(false);
      expect(validator('')).toBe(true); // Empty values skip validation
    });
  });

  describe('isBirthDateMinimumAge', () => {
    test('validates birth date for minimum age', () => {
      const validator = isBirthDateMinimumAge(18);
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      
      expect(validator(eighteenYearsAgo)).toBe(true);
      expect(validator(new Date())).toBe(false); // Born today
      expect(validator('')).toBe(true); // Empty values skip validation
    });
  });
});

describe('Address Validators', () => {
  describe('isValidStreetAddress', () => {
    test('accepts valid street addresses', () => {
      expect(isValidStreetAddress('123 Main St')).toBe(true);
      expect(isValidStreetAddress('456 Oak Ave, Apt 2B')).toBe(true);
      expect(isValidStreetAddress('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid street addresses', () => {
      expect(isValidStreetAddress('123 Main St @#$%')).toBe(false);
    });
  });

  describe('isValidCity', () => {
    test('accepts valid city names', () => {
      expect(isValidCity('New York')).toBe(true);
      expect(isValidCity('San Francisco')).toBe(true);
      expect(isValidCity("St. John's")).toBe(true);
      expect(isValidCity('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid city names', () => {
      expect(isValidCity('New York 123')).toBe(false);
      expect(isValidCity('City@Name')).toBe(false);
    });
  });

  describe('isValidUSState', () => {
    test('accepts valid US state codes', () => {
      expect(isValidUSState('CA')).toBe(true);
      expect(isValidUSState('NY')).toBe(true);
      expect(isValidUSState('DC')).toBe(true);
      expect(isValidUSState('ca')).toBe(true); // Case insensitive
      expect(isValidUSState('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid US state codes', () => {
      expect(isValidUSState('XX')).toBe(false);
      expect(isValidUSState('California')).toBe(false); // Full name not accepted
    });
  });

  describe('isValidCanadianProvince', () => {
    test('accepts valid Canadian province codes', () => {
      expect(isValidCanadianProvince('ON')).toBe(true);
      expect(isValidCanadianProvince('BC')).toBe(true);
      expect(isValidCanadianProvince('QC')).toBe(true);
      expect(isValidCanadianProvince('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid Canadian province codes', () => {
      expect(isValidCanadianProvince('XX')).toBe(false);
      expect(isValidCanadianProvince('Ontario')).toBe(false); // Full name not accepted
    });
  });

  describe('isValidUSZipCode', () => {
    test('accepts valid US ZIP codes', () => {
      expect(isValidUSZipCode('12345')).toBe(true);
      expect(isValidUSZipCode('12345-6789')).toBe(true);
      expect(isValidUSZipCode('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid US ZIP codes', () => {
      expect(isValidUSZipCode('1234')).toBe(false); // Too short
      expect(isValidUSZipCode('123456')).toBe(false); // Too long
      expect(isValidUSZipCode('abcde')).toBe(false); // Contains letters
    });
  });

  describe('isValidCanadianPostalCode', () => {
    test('accepts valid Canadian postal codes', () => {
      expect(isValidCanadianPostalCode('K1A 0A6')).toBe(true);
      expect(isValidCanadianPostalCode('M5V 3A8')).toBe(true);
      expect(isValidCanadianPostalCode('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid Canadian postal codes', () => {
      expect(isValidCanadianPostalCode('K1A0A6')).toBe(false); // Missing space
      expect(isValidCanadianPostalCode('K1A 0A')).toBe(false); // Too short
      expect(isValidCanadianPostalCode('12A 3B4')).toBe(false); // Wrong format
    });
  });
});

describe('Generic Comparison Validators', () => {
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
      expect(validator('')).toBe(true); // Empty values skip validation
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
      expect(isInteger('')).toBe(true); // Empty values skip validation
    });
  });

  describe('isDecimal', () => {
    test('validates decimal numbers correctly', () => {
      expect(isDecimal(5)).toBe(true);
      expect(isDecimal(5.5)).toBe(true);
      expect(isDecimal('10.25')).toBe(true);
      expect(isDecimal('abc')).toBe(false);
      expect(isDecimal('')).toBe(true); // Empty values skip validation
    });
  });

  describe('isInRange', () => {
    test('validates range correctly', () => {
      const validator = isInRange(1, 10);
      expect(validator(5)).toBe(true);
      expect(validator(1)).toBe(true); // Inclusive
      expect(validator(10)).toBe(true); // Inclusive
      expect(validator(0)).toBe(false);
      expect(validator(11)).toBe(false);
      expect(validator('')).toBe(true); // Empty values skip validation
    });
  });
});

describe('Password Validators', () => {
  describe('isStrongPassword', () => {
    test('validates with default options', () => {
      const validator = isStrongPassword();
      expect(validator('Password123')).toBe(true);
      expect(validator('password')).toBe(false); // No uppercase or numbers
      expect(validator('PASSWORD')).toBe(false); // No lowercase or numbers
      expect(validator('Pass123')).toBe(false); // Too short
      expect(validator('')).toBe(true); // Empty values skip validation
    });

    test('validates with custom options', () => {
      const validator = isStrongPassword({
        minLength: 6,
        requireUppercase: false,
        requireSymbols: true
      });
      expect(validator('pass123!')).toBe(true);
      expect(validator('pass123')).toBe(false); // No symbols
    });
  });
});

describe('Credit Card Validators', () => {
  describe('isValidCreditCard', () => {
    test('validates valid credit card numbers', () => {
      expect(isValidCreditCard('4532015112830366')).toBe(true); // Valid Visa
      expect(isValidCreditCard('4532-0151-1283-0366')).toBe(true); // With dashes
      expect(isValidCreditCard('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid credit card numbers', () => {
      expect(isValidCreditCard('1234567890123456')).toBe(false); // Fails Luhn
      expect(isValidCreditCard('123')).toBe(false); // Too short
    });
  });

  describe('isValidCreditCardExpiry', () => {
    test('validates valid expiry dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const month = String(futureDate.getMonth() + 1).padStart(2, '0');
      const year = String(futureDate.getFullYear()).slice(-2);
      
      expect(isValidCreditCardExpiry(`${month}${year}`)).toBe(true);
      expect(isValidCreditCardExpiry('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid expiry dates', () => {
      expect(isValidCreditCardExpiry('1320')).toBe(false); // Invalid month
      expect(isValidCreditCardExpiry('0120')).toBe(false); // Past date
    });
  });

  describe('isValidCVV', () => {
    test('validates valid CVV codes', () => {
      expect(isValidCVV('123')).toBe(true);
      expect(isValidCVV('1234')).toBe(true);
      expect(isValidCVV('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid CVV codes', () => {
      expect(isValidCVV('12')).toBe(false); // Too short
      expect(isValidCVV('12345')).toBe(false); // Too long
      expect(isValidCVV('abc')).toBe(false); // Contains letters
    });
  });
});

describe('Cross-field Validators', () => {
  describe('isSameAs', () => {
    test('validates field matching correctly', () => {
      const validator = isSameAs('password123');
      expect(validator('password123')).toBe(true);
      expect(validator('different')).toBe(false);
      expect(validator('')).toBe(true); // Empty values skip validation
    });
  });

  describe('areDateFieldsPaired', () => {
    test('validates date pairing correctly', () => {
      expect(areDateFieldsPaired('2023-01-01', '2023-01-02')).toBe(true);
      expect(areDateFieldsPaired('', '')).toBe(true); // Both empty is valid
      expect(areDateFieldsPaired('2023-01-01', '')).toBe(false); // One empty, one filled
      expect(areDateFieldsPaired('', '2023-01-02')).toBe(false); // One empty, one filled
    });
  });
});

describe('Utility Validators', () => {
  describe('isAlphaOnly', () => {
    test('validates alphabetic characters only', () => {
      expect(isAlphaOnly('abc')).toBe(true);
      expect(isAlphaOnly('ABC')).toBe(true);
      expect(isAlphaOnly('abc123')).toBe(false);
      expect(isAlphaOnly('')).toBe(true); // Empty values skip validation
    });
  });

  describe('isNumericOnly', () => {
    test('validates numeric characters only', () => {
      expect(isNumericOnly('123')).toBe(true);
      expect(isNumericOnly('abc')).toBe(false);
      expect(isNumericOnly('123abc')).toBe(false);
      expect(isNumericOnly('')).toBe(true); // Empty values skip validation
    });
  });

  describe('isValidURL', () => {
    test('validates URLs correctly', () => {
      expect(isValidURL('https://example.com')).toBe(true);
      expect(isValidURL('http://localhost:3000')).toBe(true);
      expect(isValidURL('invalid-url')).toBe(false);
      expect(isValidURL('')).toBe(true); // Empty values skip validation
    });
  });

  describe('matchesPattern', () => {
    test('validates against custom patterns', () => {
      const validator = matchesPattern(/^\d{3}-\d{2}-\d{4}$/); // SSN pattern
      expect(validator('123-45-6789')).toBe(true);
      expect(validator('123456789')).toBe(false);
      expect(validator('')).toBe(true); // Empty values skip validation
    });
  });

  describe('isWithinTheLastYear', () => {
    test('validates dates within the last year', () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      
      expect(isWithinTheLastYear(sixMonthsAgo)).toBe(true);
      expect(isWithinTheLastYear(twoYearsAgo)).toBe(false);
      expect(isWithinTheLastYear('')).toBe(true); // Empty values skip validation
    });
  });

  describe('isInTheFuture', () => {
    test('validates future dates correctly', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(isInTheFuture(tomorrow)).toBe(true);
      expect(isInTheFuture(yesterday)).toBe(false);
      expect(isInTheFuture('')).toBe(true); // Empty values skip validation
    });

    test('handles invalid dates gracefully', () => {
      expect(isInTheFuture('invalid-date')).toBe(true); // Skip validation for invalid dates
      expect(isInTheFuture('2023-13-45')).toBe(true); // Invalid date format
    });
  });
});

describe('Color Validators', () => {
  describe('isValidHexColor', () => {
    test('validates hex color codes correctly', () => {
      expect(isValidHexColor('#FF0000')).toBe(true); // 6-digit hex
      expect(isValidHexColor('#f00')).toBe(true); // 3-digit hex
      expect(isValidHexColor('#123ABC')).toBe(true); // Mixed case
      expect(isValidHexColor('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid hex color codes', () => {
      expect(isValidHexColor('FF0000')).toBe(false); // Missing #
      expect(isValidHexColor('#GG0000')).toBe(false); // Invalid characters
      expect(isValidHexColor('#FF00')).toBe(false); // Wrong length
      expect(isValidHexColor('#FF00000')).toBe(false); // Too long
    });
  });
});

describe('Time Validators', () => {
  describe('isValidTime', () => {
    test('validates time formats correctly', () => {
      expect(isValidTime('09:30')).toBe(true); // HH:MM with leading zero
      expect(isValidTime('9:30')).toBe(true); // H:MM without leading zero (valid)
      expect(isValidTime('23:59')).toBe(true); // 24-hour format
      expect(isValidTime('00:00')).toBe(true); // Midnight
      expect(isValidTime('12:30:45')).toBe(true); // HH:MM:SS
      expect(isValidTime('')).toBe(true); // Empty values skip validation
    });

    test('rejects invalid time formats', () => {
      expect(isValidTime('25:00')).toBe(false); // Invalid hour
      expect(isValidTime('12:60')).toBe(false); // Invalid minute
      expect(isValidTime('12:30:60')).toBe(false); // Invalid second
      expect(isValidTime('12:5')).toBe(false); // Single digit minute without leading zero
      expect(isValidTime('abc:30')).toBe(false); // Non-numeric hour
      expect(isValidTime('12:ab')).toBe(false); // Non-numeric minute
    });
  });
});

describe('Conditional Validators', () => {
  describe('isRequiredIf', () => {
    test('validates conditionally required fields', () => {
      const requiredValidator = isRequiredIf(true);
      const notRequiredValidator = isRequiredIf(false);
      
      expect(requiredValidator('test')).toBe(true);
      expect(requiredValidator('')).toBe(false); // Required but empty
      expect(requiredValidator(null)).toBe(false); // Required but null
      
      expect(notRequiredValidator('test')).toBe(true);
      expect(notRequiredValidator('')).toBe(true); // Not required, empty is ok
      expect(notRequiredValidator(null)).toBe(true); // Not required, null is ok
    });
  });
});
