// =============================================================================
// HELPER UTILITIES
// =============================================================================

/**
 * Wraps a validator to skip empty, null, or undefined values.
 */
const withOptional = <T extends any[], R>(
  validator: (...args: T) => R
) => (...args: T): R | true => {
  const value = args[0];
  if (value === null || value === undefined || value === '') return true as R | true;
  return validator(...args);
};

/**
 * Safely parses a date. Returns null if invalid.
 */
const parseDate = (date: string | number | Date | null | undefined): Date | null => {
  if (date === null || date === undefined) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Creates a regex-based validator with optional empty values allowed.
 */
const matches = (regex: RegExp) =>
  withOptional((value: string) => regex.test(value.trim()));

// =============================================================================
// BASIC VALIDATORS
// =============================================================================

export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

export const hasMinLength = (minLength: number) =>
  withOptional((value: string) => value.length >= minLength);

export const hasMaxLength = (maxLength: number) =>
  withOptional((value: string) => value.length <= maxLength);

// =============================================================================
// STRING / PATTERN VALIDATORS
// =============================================================================

export const isAsciiAlphanumeric = matches(/^[a-zA-Z0-9]+$/);
export const isAlphaOnly = matches(/^[a-zA-Z]+$/);
export const isNumericOnly = matches(/^\d+$/);
export const isValidName = matches(/^[a-zA-Z\s\-']+$/);
export const isValidStreetAddress = matches(/^[a-zA-Z0-9\s\-'\.#,]+$/);
export const isValidUSZipCode = matches(/^\d{5}(-\d{4})?$/);
export const isValidCanadianPostalCode = matches(/^[A-Z]\d[A-Z] \d[A-Z]\d$/i);
export const isValidHexColor = matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
export const isValidTime = matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/);

export const matchesPattern = (pattern: RegExp) => matches(pattern);

// =============================================================================
// EMAIL / URL VALIDATORS
// =============================================================================

export const isValidEmail = matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

export const isValidURL = withOptional((value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
});

// =============================================================================
// PHONE VALIDATORS
// =============================================================================

const cleanDigits = (value: string): string => value.replace(/\D/g, '');

export const isValidUSPhone = withOptional((value: string) => {
  const cleaned = cleanDigits(value);
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
});

export const isValidInternationalPhone = withOptional((value: string) => {
  const cleaned = cleanDigits(value);
  return cleaned.length >= 7 && cleaned.length <= 15;
});

// =============================================================================
// DATE & TIME VALIDATORS
// =============================================================================

export const isAfter = (reference: Date | string | number) =>
  withOptional((value: Date | string | number) => {
    const d1 = parseDate(value);
    const d2 = parseDate(reference);
    return !d1 || !d2 ? true : d1 > d2;
  });

export const isBefore = (reference: Date | string | number) =>
  withOptional((value: Date | string | number) => {
    const d1 = parseDate(value);
    const d2 = parseDate(reference);
    return !d1 || !d2 ? true : d1 < d2;
  });

export const isWithinLastYear = withOptional((value: string | Date) => {
  const d = parseDate(value);
  if (!d) return true;
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return d >= oneYearAgo;
});

export const isInTheFuture = isAfter(new Date());

// Minimum age (birth date)
export const isBirthDateMinimumAge = (minAge: number) =>
  withOptional((birthDate: string | Date) => {
    const birth = parseDate(birthDate);
    if (!birth) return true;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= minAge;
  });

// Paired dates
export const areDateFieldsPaired = (date1: any, date2: any): boolean => {
  const hasDate1 = Boolean(date1 && date1.toString().trim().length > 0);
  const hasDate2 = Boolean(date2 && date2.toString().trim().length > 0);
  return hasDate1 === hasDate2 || (!hasDate1 && !hasDate2);
};

// =============================================================================
// REGION VALIDATORS
// =============================================================================

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
];

const CANADIAN_PROVINCES = [
  'AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'
];

const isOneOfList = (list: string[]) =>
  withOptional((value: string) => list.includes(value.trim().toUpperCase()));

export const isValidUSState = isOneOfList(US_STATES);
export const isValidCanadianProvince = isOneOfList(CANADIAN_PROVINCES);

// =============================================================================
// NUMERIC VALIDATORS
// =============================================================================

export const isInteger = withOptional((value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && Number.isInteger(num);
});

export const isDecimal = withOptional((value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && isFinite(num);
});

export const isInRange = (min: number, max: number) =>
  withOptional((value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) && num >= min && num <= max;
  });

export const greaterThan = (min: number) =>
  withOptional((value: number | string) => +value > min);

export const lessThan = (max: number) =>
  withOptional((value: number | string) => +value < max);

export const greaterThanOrEqual = (min: number) =>
  withOptional((value: number | string) => +value >= min);

export const lessThanOrEqual = (max: number) =>
  withOptional((value: number | string) => +value <= max);

// =============================================================================
// PASSWORD VALIDATORS
// =============================================================================

interface PasswordOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSymbols?: boolean;
}

export const isStrongPassword = (options: PasswordOptions = {}) =>
  withOptional((value: string) => {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSymbols = false,
    } = options;

    if (value.length < minLength) return false;
    if (requireUppercase && !/[A-Z]/.test(value)) return false;
    if (requireLowercase && !/[a-z]/.test(value)) return false;
    if (requireNumbers && !/\d/.test(value)) return false;
    if (requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return false;

    return true;
  });

// =============================================================================
// CREDIT CARD VALIDATORS
// =============================================================================

export const isValidCreditCard = withOptional((value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
});

export const isValidCreditCardExpiry = withOptional((value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length !== 4 && cleaned.length !== 6) return false;

  const month = parseInt(cleaned.substring(0, 2), 10);
  const year = parseInt(cleaned.length === 4
    ? '20' + cleaned.substring(2, 4)
    : cleaned.substring(2, 6), 10);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return year > currentYear || (year === currentYear && month >= currentMonth);
});

export const isValidCVV = matches(/^\d{3,4}$/);

// =============================================================================
// CONDITIONAL VALIDATORS
// =============================================================================

export const isRequiredIf = (condition: boolean) => (value: any): boolean =>
  condition ? isRequired(value) : true;

export const isEqual = (comparison: any) => (value: any): boolean =>
  value === comparison || (value == null && comparison == null);

export const isOneOf = (allowedValues: any[]) =>
  withOptional((value: any) => allowedValues.includes(value));

export const isSameAs = (otherFieldValue: any) =>
  withOptional((value: any) => value === otherFieldValue);
