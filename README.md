# Sonic Form Hook

A lightweight, TypeScript-first React form validation hook with natural event-driven validation.

This form validation library is born from my frustration with the existing solutions available in the React space. Most forms are simple enough. The constraints of each field need to be defined and then you as a developer just need to decide what to do with the form data once everything `isValid`. Many form solutions cover a lot of ground that is unecessary for most situations.

## Features

- **Natural Event Validation** - Validates immediately on change, re-validates on blur
- **Cross-field Validation** - `relatedFields` automatically re-validate dependent fields
- **Nested Field Support** - `nestedFieldOf` allows auxiliary inputs to validate against a main field
- **Flexible Validation** - Custom validation functions with custom error messages
- **TypeScript Support** - Full type safety with comprehensive interfaces
- **Lightweight** - No dependencies beyond React-16.8+ (4.2Kb Gzipped)
- **External State** - You control your own form state and errors

## Installation

NOTE: This is not published to npm yet

```bash
npm install @rorsach/sonic-form
```

## Basic Usage

```tsx
import React, { useState } from "react";
import { useForm, isRequired, isValidEmail, isAsciiAlphanumeric, hasMinLength } from "@rorsach/sonic-form";

const MyForm = () => {
  const [formValues, setFormValues] = useState({ username: "", email: "" });
  const [errors, setErrors] = useState({});

  const validationOptions = {
    username: {
      validations: [
        {
          isValid: isRequired,
          errorMessage: "Username is required",
        },
        {
          isValid: hasMinLength(3),
          errorMessage: "Username must be at least 3 characters",
        },
        {
          isValid: isAsciiAlphanumeric,
          errorMessage: "Username can only contain letters and numbers",
        },
      ],
    },
    email: {
      validations: [
        {
          isValid: isRequired,
          errorMessage: "Email is required",
        },
        {
          isValid: isValidEmail,
          errorMessage: "Please enter a valid email address",
        },
      ],
    },
  };

  const { handleChange, handleBlur, handleSubmit } = useForm({
    formValues,
    setFormValues,
    errors,
    setErrors,
    validationOptions,
  });

  const onFormSubmit = async (event) => {
    const isValid = await handleSubmit(event);
    if (isValid) {
      console.log("Form submitted:", formValues);
      // Handle successful submission
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        name="username"
        value={formValues.username}
        onChange={handleChange} // Updates value + validates immediately
        onBlur={handleBlur} // Re-validates field
        placeholder="Username"
      />
      {errors.username && <span className="error">{errors.username}</span>}

      <input
        name="email"
        type="email"
        value={formValues.email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Email Address"
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <button type="submit">Submit</button>
    </form>
  );
};
```

## Validation Behavior

### onChange Event

1. **Updates field value** immediately
2. **Validates the field** immediately
3. **Validates related fields** if they have existing errors

### onBlur Event

1. **Validates the field**
2. **Validates related fields** if they have existing errors

### onSubmit Event

1. **Validates all fields** in the validation options
2. **Returns boolean** indicating if form is valid
3. **Prevents default** form submission

## TypeScript Interfaces

```tsx
interface ValidationOption {
  validations?: Array<Validation>;
  relatedFields?: string[];
  nestedFieldOf?: string;
}

interface Validation {
  isValid: (arg: any) => boolean;
  errorMessage: string;
}

interface FormValues {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}
```

## API Reference

### useForm Parameters

| Parameter           | Type                                               | Description                             |
| ------------------- | -------------------------------------------------- | --------------------------------------- |
| `formValues`        | `FormValues`                                       | Current form values state               |
| `setFormValues`     | `React.Dispatch<React.SetStateAction<FormValues>>` | State setter for form values            |
| `errors`            | `FormErrors`                                       | Current form errors state               |
| `setErrors`         | `React.Dispatch<React.SetStateAction<FormErrors>>` | State setter for form errors            |
| `validationOptions` | `{ [key: string]: ValidationOption }`              | Validation configuration for each field |

### useForm Returns

| Handler                  | Type                          | Description                            |
| ------------------------ | ----------------------------- | -------------------------------------- |
| `handleChange`           | `(event) => void`             | Attach to input `onChange` events      |
| `handleBlur`             | `(event) => void`             | Attach to input `onBlur` events        |
| `handleSubmit`           | `(event) => Promise<boolean>` | Attach to form `onSubmit` event        |
| `handleDropdownChange`   | `(event) => void`             | Attach to select `onChange` events     |
| `handleDatePickerChange` | `(event) => void`             | Attach to date picker `onInput` events |

## Examples

Check the `/examples` directory for complete working examples:

- **Basic Form** - Simple email/password validation
- **Cross-field Validation** - Date range validation with related fields
- **Password Confirmation** - Registration form with password matching and strength validation
- **Address Validation** - Complex country-dependent address validation with conditional requirements
- **Nested Fields** - Using `nestedFieldOf` for time picker validation

## Why This Approach?

- **Immediate Feedback** - Users see validation results as they type
- **Natural UX** - Errors appear and disappear naturally with user input
- **No "Touched" State** - Simpler logic without conditional validation
- **Lightweight** - Minimal state management overhead
- **Flexible** - Works with any state management approach
- **Explicit** - You control your own state, no magic

## Built-in Validators

### Basic Validators
- `isRequired` - Field must have a value
- `hasMinLength(length)` - Minimum string length
- `hasMaxLength(length)` - Maximum string length

### String/Pattern Validators
- `isAsciiAlphanumeric` - Letters and numbers only
- `isAlphaOnly` - Letters only
- `isNumericOnly` - Numbers only
- `isValidName` - Names with letters, spaces, hyphens, apostrophes
- `isValidStreetAddress` - Street addresses with numbers and symbols
- `matchesPattern(regex)` - Custom regex validation

### Email/URL Validators
- `isValidEmail` - Basic email format validation
- `isValidURL` - Valid URL format

### Phone Validators
- `isValidUSPhone` - US phone numbers (10 or 11 digits)
- `isValidInternationalPhone` - International phone (7-15 digits)

### Date/Time Validators
- `isAfter(date)` - Date must be after reference
- `isBefore(date)` - Date must be before reference
- `isWithinLastYear` - Date within the last year
- `isInTheFuture` - Date must be in the future
- `isBirthDateMinimumAge(age)` - Birth date for minimum age
- `areDateFieldsPaired` - Both dates present or both empty
- `isValidTime` - Time format (HH:MM or HH:MM:SS)

### Geographic Validators
- `isValidUSState` - US state codes (CA, NY, etc.)
- `isValidCanadianProvince` - Canadian province codes
- `isValidUSZipCode` - US ZIP codes (12345 or 12345-6789)
- `isValidCanadianPostalCode` - Canadian postal codes (A1A 1A1)
- `isValidHexColor` - Hex color codes (#FF0000 or #F00)

### Numeric Validators
- `isInteger` - Whole numbers only
- `isDecimal` - Any valid number
- `isInRange(min, max)` - Number within range
- `greaterThan(min)` - Greater than value
- `lessThan(max)` - Less than value
- `greaterThanOrEqual(min)` - Greater than or equal
- `lessThanOrEqual(max)` - Less than or equal

### Password Validators
- `isStrongPassword(options)` - Configurable password strength

### Credit Card Validators
- `isValidCreditCard` - Luhn algorithm validation
- `isValidCreditCardExpiry` - MM/YY or MMYY format
- `isValidCVV` - 3 or 4 digit CVV

### Conditional Validators
- `isRequiredIf(condition)` - Required only if condition is true
- `isEqual(value)` - Must equal specific value
- `isOneOf(array)` - Must be one of allowed values
- `isSameAs(otherValue)` - Must match another field value

## License

MIT
