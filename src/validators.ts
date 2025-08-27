// Helper validation functions for cross-field validation
export const areDateFieldsPaired = (date1: any, date2: any): boolean => {
  const hasDate1 = Boolean(date1 && date1.toString().trim().length > 0);
  const hasDate2 = Boolean(date2 && date2.toString().trim().length > 0);
  
  // If one date is entered, both should be entered
  if (hasDate1 || hasDate2) {
    return hasDate1 && hasDate2;
  }
  
  // If neither is entered, that's valid (both optional)
  return true;
};

export const isEndDateAfterStartDate = (startDate: any, endDate: any): boolean => {
  if (!endDate || !startDate) return true; // Skip validation if dates are missing
  
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  
  return endDateTime > startDateTime;
};

/**
 * Validates that a date is within the last year
 */
export const isWithinTheLastYear = (date: string | Date): boolean => {
  if (!date) return true;
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return new Date(date) >= oneYearAgo;
};

const isAsciiAlphanumeric = (value: string): boolean => {
  if (!value) return true; // Skip validation for empty values (consistency fix)
  return /^[a-zA-Z0-9]+$/.test(value);
};

export { isAsciiAlphanumeric };

/**
 * Checks if a given date is in the future.
 * 
 * @param date - The date to check. Can be a string, number, or Date object.
 * @returns A boolean indicating whether the date is in the future.
 */
export const isInTheFuture = (date: string | number | Date): boolean => {
  if (!date) return true;
  
  let parsedDate: Date;
  if (typeof date === 'string') {
    parsedDate = new Date(date);
  } else if (typeof date === 'number') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }
  
  // Check if date is valid
  if (isNaN(parsedDate.getTime())) return true; // Skip validation for invalid dates
  
  return parsedDate > new Date();
};
// =============================================================================
// BASIC VALIDATORS
// =============================================================================

/**
 * Validates that a field has a value (not empty, null, or undefined)
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

/**
 * Validates minimum length for strings
 */
export const hasMinLength = (minLength: number) => (value: string): boolean => {
  if (!value) return true; // Skip validation for empty values
  return value.length >= minLength;
};

/**
 * Validates maximum length for strings
 */
export const hasMaxLength = (maxLength: number) => (value: string): boolean => {
  if (!value) return true; // Skip validation for empty values
  return value.length <= maxLength;
};

// =============================================================================
// NAME VALIDATORS
// =============================================================================

/**
 * Validates a person's name (allows letters, spaces, hyphens, apostrophes)
 */
export const isValidName = (value: string): boolean => {
  if (!value) return true; // Skip validation for empty values
  return /^[a-zA-Z\s\-']+$/.test(value.trim());
};

// =============================================================================
// EMAIL VALIDATORS
// =============================================================================

/**
 * Basic email validation (best effort client-side validation)
 * Note: Complete email validation requires server-side verification
 */
export const isValidEmail = (value: string): boolean => {
  if (!value) return true; // Skip validation for empty values
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.trim());
};

// =============================================================================
// TELEPHONE VALIDATORS
// =============================================================================

/**
 * Validates US phone number (various formats accepted)
 */
export const isValidUSPhone = (value: string): boolean => {
  if (!value) return true;
  const cleaned = value.replace(/\D/g, '');
  
  // Must be 10 digits (US) or 11 digits starting with 1 (US with country code)
  if (cleaned.length === 10) return true;
  if (cleaned.length === 11 && cleaned.startsWith('1')) return true;
  
  return false;
};

/**
 * Validates international phone number (basic format)
 */
export const isValidInternationalPhone = (value: string): boolean => {
  if (!value) return true;
  const cleaned = value.replace(/\D/g, '');
  
  // International numbers: 7-15 digits
  return cleaned.length >= 7 && cleaned.length <= 15;
};

// =============================================================================
// AGE VALIDATORS
// =============================================================================

/**
 * Validates age is within reasonable range (0-150)
 */
export const isValidAge = (value: number | string): boolean => {
  if (value === null || value === undefined || value === '') return true;
  const age = typeof value === 'string' ? parseInt(value, 10) : value;
  return !isNaN(age) && age >= 0 && age <= 150;
};

/**
 * Validates age is at least minimum required
 */
export const isMinimumAge = (minAge: number) => (value: number | string): boolean => {
  if (value === null || value === undefined || value === '') return true;
  const age = typeof value === 'string' ? parseInt(value, 10) : value;
  return !isNaN(age) && age >= minAge;
};

/**
 * Validates birth date corresponds to minimum age
 */
export const isBirthDateMinimumAge = (minAge: number) => (birthDate: string | Date): boolean => {
  if (!birthDate) return true;
  
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge;
  }
  
  return age >= minAge;
};

// =============================================================================
// ADDRESS VALIDATORS
// =============================================================================

/**
 * Validates street address (basic format)
 */
export const isValidStreetAddress = (value: string): boolean => {
  if (!value) return true;
  const trimmed = value.trim();
  // Just check it's not empty and has some basic structure
  return /^[a-zA-Z0-9\s\-'\.#,]+$/.test(trimmed);
};

/**
 * Validates city name
 */
export const isValidCity = (value: string): boolean => {
  if (!value) return true;
  return /^[a-zA-Z\s\-'\.]+$/.test(value.trim());
};

/**
 * Validates US state (2-letter code)
 */
export const isValidUSState = (value: string): boolean => {
  if (!value) return true;
  const trimmed = value.trim().toUpperCase();
  
  const stateCodes = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC'
  ];
  
  return stateCodes.includes(trimmed);
};

/**
 * Validates Canadian province/territory (2-letter code)
 */
export const isValidCanadianProvince = (value: string): boolean => {
  if (!value) return true;
  const trimmed = value.trim().toUpperCase();
  
  const provinceCodes = [
    'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
  ];
  
  return provinceCodes.includes(trimmed);
};

/**
 * Validates US ZIP code (5 digits or 5+4 format)
 */
export const isValidUSZipCode = (value: string): boolean => {
  if (!value) return true;
  return /^\d{5}(-\d{4})?$/.test(value.trim());
};

/**
 * Validates Canadian postal code
 */
export const isValidCanadianPostalCode = (value: string): boolean => {
  if (!value) return true;
  return /^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(value.trim().toUpperCase());
};

// =============================================================================
// ADDITIONAL CROSS-FIELD VALIDATORS
// =============================================================================

/**
 * Validates that state is required for specific countries
 */
export const isStateRequired = (country: string, state: string): boolean => {
  if (!country) return true;
  
  const requiresState = ['US', 'USA', 'CA', 'CANADA'].includes(country.toUpperCase());
  if (requiresState) {
    return Boolean(state && state.trim().length > 0);
  }
  
  return true; // State not required for other countries
};

// =============================================================================
// UTILITY VALIDATORS
// =============================================================================

/**
 * Validates that value contains only letters
 */
export const isAlphaOnly = (value: string): boolean => {
  if (!value) return true;
  return /^[a-zA-Z]+$/.test(value);
};

/**
 * Validates that value contains only numbers
 */
export const isNumericOnly = (value: string): boolean => {
  if (!value) return true;
  return /^\d+$/.test(value);
};

/**
 * Validates URL format
 */
export const isValidURL = (value: string): boolean => {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates that value matches a specific pattern
 */
export const matchesPattern = (pattern: RegExp) => (value: string): boolean => {
  if (!value) return true;
  return pattern.test(value);
};

// =============================================================================
// COLOR VALIDATORS
// =============================================================================

/**
 * Validates hex color code format (#RGB or #RRGGBB)
 */
export const isValidHexColor = (value: string): boolean => {
  if (!value) return true;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value.trim());
};

// =============================================================================
// TIME VALIDATORS
// =============================================================================

/**
 * Validates time format (HH:MM or HH:MM:SS, 24-hour format)
 */
export const isValidTime = (value: string): boolean => {
  if (!value) return true;
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return timeRegex.test(value.trim());
};

// =============================================================================
// CONDITIONAL VALIDATORS
// =============================================================================

/**
 * Makes a field required based on a condition
 */
export const isRequiredIf = (condition: boolean) => (value: any): boolean => {
  if (condition) {
    return isRequired(value);
  }
  return true;
};
// =============================================================================
// GENERIC COMPARISON VALIDATORS
// =============================================================================

/**
 * Validates that a value equals a specific comparison value
 */
export const isEqual = (comparison: any) => (value: any): boolean => {
  if (value === null || value === undefined) return comparison === null || comparison === undefined;
  return value === comparison;
};

/**
 * Validates that a value is one of the allowed values
 */
export const isOneOf = (allowedValues: any[]) => (value: any): boolean => {
  if (!value && value !== 0 && value !== false) return true; // Skip validation for empty values
  return allowedValues.includes(value);
};

// =============================================================================
// NUMERIC VALIDATORS
// =============================================================================

/**
 * Validates that a value is an integer
 */
export const isInteger = (value: number | string): boolean => {
  if (value === null || value === undefined || value === '') return true;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && Number.isInteger(num);
};

/**
 * Validates that a value is a decimal number
 */
export const isDecimal = (value: number | string): boolean => {
  if (value === null || value === undefined || value === '') return true;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && isFinite(num);
};

/**
 * Validates that a number is within a specific range (inclusive)
 */
export const isInRange = (min: number, max: number) => (value: number | string): boolean => {
  if (value === null || value === undefined || value === '') return true;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= min && num <= max;
};

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

/**
 * Validates password strength based on configurable options
 */
export const isStrongPassword = (options: PasswordOptions = {}) => (value: string): boolean => {
  if (!value) return true; // Skip validation for empty values
  
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSymbols = false
  } = options;
  
  if (value.length < minLength) return false;
  if (requireUppercase && !/[A-Z]/.test(value)) return false;
  if (requireLowercase && !/[a-z]/.test(value)) return false;
  if (requireNumbers && !/\d/.test(value)) return false;
  if (requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return false;
  
  return true;
};

// =============================================================================
// CREDIT CARD VALIDATORS
// =============================================================================

/**
 * Validates credit card number using Luhn algorithm
 */
export const isValidCreditCard = (value: string): boolean => {
  if (!value) return true;
  
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Must be between 13-19 digits (common credit card lengths)
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  // Process digits from right to left
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Validates credit card expiry date (MM/YY or MM/YYYY format)
 */
export const isValidCreditCardExpiry = (value: string): boolean => {
  if (!value) return true;
  
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length !== 4 && cleaned.length !== 6) return false;
  
  const month = parseInt(cleaned.substring(0, 2), 10);
  const year = parseInt(cleaned.length === 4 ? 
    '20' + cleaned.substring(2, 4) : 
    cleaned.substring(2, 6), 10);
  
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
};

/**
 * Validates CVV/CVC code (3-4 digits)
 */
export const isValidCVV = (value: string): boolean => {
  if (!value) return true;
  return /^\d{3,4}$/.test(value.trim());
};

// =============================================================================
// IMPROVED CROSS-FIELD VALIDATORS
// =============================================================================

/**
 * Generic validator to check if a field matches another field's value
 * Replaces the specific isPasswordMatch validator
 */
export const isSameAs = (otherFieldValue: any) => (value: any): boolean => {
  if (!value) return true; // Don't validate empty values
  return value === otherFieldValue;
};
