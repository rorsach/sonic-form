// =============================================================================
// HELPER UTILITIES
// =============================================================================

/**
 * Resolves field references (@fieldName) to actual values from formValues
 */
const resolveFieldRef = (arg: unknown, formValues?: { [key: string]: unknown }): unknown => {
  if (typeof arg === 'string' && arg.startsWith('@') && formValues) {
    const fieldName = arg.slice(1);
    return formValues[fieldName];
  }
  return arg;
};

/**
 * Creates field-aware validators that can resolve field references
 */
const createFieldAwareValidator = <T extends unknown[]>(
  validator: (...args: T) => boolean | true
) => (...args: T) => (value: unknown, formValues?: { [key: string]: unknown }): boolean | true => {
  const resolvedArgs = args.map(arg => resolveFieldRef(arg, formValues)) as T;
  return validator(value, ...resolvedArgs);
};

// Field-aware versions of validators
export const isAfterField = (reference: string) => (value: unknown, formValues?: { [key: string]: unknown }): boolean | true => {
  const referenceValue = reference.startsWith('@') && formValues ? formValues[reference.slice(1)] : reference;
  if (!value || !referenceValue) return true;
  const d1 = parseDate(value as Date | string | number);
  const d2 = parseDate(referenceValue as Date | string | number);
  return !d1 || !d2 ? true : d1 > d2;
};

export const areDateFieldsPairedField = (otherField: string) => (value: unknown, formValues?: { [key: string]: unknown }): boolean | true => {
  const otherValue = otherField.startsWith('@') && formValues ? formValues[otherField.slice(1)] : otherField;
  const hasValue = Boolean(value && value.toString().trim().length > 0);
  const hasOther = Boolean(otherValue && otherValue.toString().trim().length > 0);
  return hasValue === hasOther || (!hasValue && !hasOther);
};
const withOptional = <T extends unknown[], R>(
  validator: (...args: T) => R,
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
const matches = (regex: RegExp): ((value: string) => boolean | true) =>
  withOptional((value: string): boolean => regex.test(value.trim()));

// =============================================================================
// BASIC VALIDATORS
// =============================================================================

export const isRequired = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

export const hasMinLength = (minLength: number): ((value: string) => boolean | true) =>
  withOptional((value: string): boolean => value.length >= minLength);

export const hasMaxLength = (maxLength: number): ((value: string) => boolean | true) =>
  withOptional((value: string): boolean => value.length <= maxLength);

// =============================================================================
// STRING / PATTERN VALIDATORS
// =============================================================================

export const isAsciiAlphanumeric = matches(/^[a-zA-Z0-9]+$/);
export const isAlphaOnly = matches(/^[a-zA-Z]+$/);
export const isNumericOnly = matches(/^\d+$/);
export const isValidName = matches(/^[a-zA-Z\s\-']+$/);
export const isValidStreetAddress = matches(/^[a-zA-Z0-9\s\-'.#,]+$/);
export const isValidUSZipCode = matches(/^\d{5}(-\d{4})?$/);
export const isValidCanadianPostalCode = matches(/^[A-Z]\d[A-Z] \d[A-Z]\d$/i);
export const isValidHexColor = matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
export const isValidTime = matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/);

export const matchesPattern = (pattern: RegExp): ((value: string) => boolean | true) => matches(pattern);

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

export const isAfter = (reference: Date | string | number): ((value: Date | string | number) => boolean | true) =>
  withOptional((value: Date | string | number): boolean => {
    const d1 = parseDate(value);
    const d2 = parseDate(reference);
    return !d1 || !d2 ? true : d1 > d2;
  });

export const isBefore = (reference: Date | string | number): ((value: Date | string | number) => boolean | true) =>
  withOptional((value: Date | string | number): boolean => {
    const d1 = parseDate(value);
    const d2 = parseDate(reference);
    return !d1 || !d2 ? true : d1 < d2;
  });

export const isWithinLastYear = withOptional((value: string | Date): boolean => {
  const d = parseDate(value);
  if (!d) return true;
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return d >= oneYearAgo;
});

export const isInTheFuture = isAfter(new Date());

// Minimum age (birth date)
export const isBirthDateMinimumAge = (minAge: number): ((birthDate: string | Date) => boolean | true) =>
  withOptional((birthDate: string | Date): boolean => {
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
export const areDateFieldsPaired = (date1: unknown, date2: unknown): boolean => {
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
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

const CANADIAN_PROVINCES = [
  'AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT',
];

const isOneOfList = (list: string[]): ((value: string) => boolean | true) =>
  withOptional((value: string): boolean => list.includes(value.trim().toUpperCase()));

export const isValidUSState = isOneOfList(US_STATES);
export const isValidCanadianProvince = isOneOfList(CANADIAN_PROVINCES);

// =============================================================================
// NUMERIC VALIDATORS
// =============================================================================

export const isInteger = withOptional((value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && Number.isInteger(num);
});

export const isDecimal = withOptional((value: number | string): boolean => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && isFinite(num);
});

export const isInRange = (min: number, max: number): ((value: number | string) => boolean | true) =>
  withOptional((value: number | string): boolean => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) && num >= min && num <= max;
  });

export const greaterThan = (min: number): ((value: number | string) => boolean | true) =>
  withOptional((value: number | string): boolean => +value > min);

export const lessThan = (max: number): ((value: number | string) => boolean | true) =>
  withOptional((value: number | string): boolean => +value < max);

export const greaterThanOrEqual = (min: number): ((value: number | string) => boolean | true) =>
  withOptional((value: number | string): boolean => +value >= min);

export const lessThanOrEqual = (max: number): ((value: number | string) => boolean | true) =>
  withOptional((value: number | string): boolean => +value <= max);

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

export const isStrongPassword = (options: PasswordOptions = {}): ((value: string) => boolean | true) =>
  withOptional((value: string): boolean => {
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
    if (requireSymbols && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) return false;

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

export const isRequiredIf = (condition: boolean) => (value: unknown): boolean =>
  condition ? isRequired(value) : true;

export const isEqual = (comparison: unknown) => (value: unknown): boolean =>
  value === comparison || (value == null && comparison == null);

export const isOneOf = (allowedValues: unknown[]): ((value: unknown) => boolean | true) => 
  withOptional((value: unknown): boolean => allowedValues.includes(value));

export const isSameAs = (otherFieldValue: unknown): ((value: unknown) => boolean | true) =>
  withOptional((value: unknown): boolean => value === otherFieldValue);
