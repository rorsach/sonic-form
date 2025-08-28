# Sonic Form Hook

A lightweight, TypeScript-first React form validation hook with natural event-driven validation.

This form validation library is born from my frustration with the existing solutions available in the React space. Most forms are simple enough. The constraints of each field need to be defined and then you as a developer just need to decide what to do with the form data once everything `isValid`. Many form solutions cover a lot of ground that is unecessary for most situations.

## Features

- **🎯 Natural Event Validation** - Validates immediately on change, re-validates on blur
- **🔗 Cross-field Validation** - `relatedFields` automatically re-validate dependent fields
- **🔗 Nested Field Support** - `nestedFieldOf` allows auxiliary inputs to validate against a main field
- **🎨 Flexible Validation** - Custom validation functions with custom error messages
- **📝 TypeScript Support** - Full type safety with comprehensive interfaces
- **🪶 Lightweight** - No dependencies beyond React (16.8)
- **🎛️ External State** - You control your own form state and errors

## Installation

NOTE: This is not published to npm yet

```bash
npm install @rorsach/sonic-form
```

## Basic Usage

```tsx
import React, { useState } from "react";
import { useForm, isRequired, isValidEmail, isValidName } from "@rorsach/sonic-form";

const MyForm = () => {
  const [formValues, setFormValues] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});

  const validationOptions = {
    name: {
      validations: [
        {
          isValid: isRequired,
          errorMessage: "Name is required",
        },
        {
          isValid: isValidName,
          errorMessage: "Please enter a valid name",
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
        name="name"
        value={formValues.name}
        onChange={handleChange} // Updates value + validates immediately
        onBlur={handleBlur} // Re-validates field
        placeholder="Full Name"
      />
      {errors.name && <span className="error">{errors.name}</span>}

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

## Advanced Features

### Cross-field Validation with `relatedFields`

When one field changes, automatically re-validate related fields that have errors:

```tsx
const validationOptions = {
  startDate: {
    validations: [
      {
        isValid: (value) => value && value.trim().length > 0,
        errorMessage: "Start date is required",
      },
    ],
    relatedFields: ["endDate"], // Re-validate endDate when startDate changes
  },
  endDate: {
    validations: [
      {
        isValid: (value) => value && value.trim().length > 0,
        errorMessage: "End date is required",
      },
      {
        isValid: (value) => {
          if (!value || !formValues.startDate) return true;
          return new Date(value) > new Date(formValues.startDate);
        },
        errorMessage: "End date must be after start date",
      },
    ],
    relatedFields: ["startDate"],
  },
};
```

### Cross-field Validation with `partialFn`

`partialFn` is a partial application function that enables validation scenarios where fields depend on each other. It's for validating addresses, date/time ranges, and conditional field requirements.

#### Basic partialFn Usage

```tsx
import {
  partialFn,
  areBothDatesEntered,
  isEndDateAfterStartDate,
} from "@rorsach/sonic-form";

const validationOptions = {
  startDate: {
    validations: [
      {
        isValid: partialFn(
          areBothDatesEntered,
          partialFn_,
          formValues.endDate
        ),
        errorMessage: "If start date is entered, end date is also required",
      },
    ],
    relatedFields: ["endDate"],
  },
  endDate: {
    validations: [
      {
        isValid: partialFn(
          areBothDatesEntered,
          formValues.startDate,
          partialFn_
        ),
        errorMessage: "If end date is entered, start date is also required",
      },
      {
        isValid: partialFn(
          isEndDateAfterStartDate,
          formValues.startDate,
          partialFn_
        ),
        errorMessage: "End date must be after start date",
      },
    ],
    relatedFields: ["startDate"],
  },
};
```

#### Conditional Field Requirements

For scenarios where fields are only required based on other field values:

#### Address Validation Example

```tsx
const validationOptions = {
  country: {
    validations: [
      {
        isValid: (value) => value && value.trim().length > 0,
        errorMessage: "Country is required",
      },
    ],
    relatedFields: ["state", "zipCode"],
  },
  state: {
    validations: [
      {
        isValid: partialFn(isStateRequired, formValues.country, partialFn_),
        errorMessage: "State is required for US addresses",
      },
    ],
  },
  zipCode: {
    validations: [
      {
        isValid: partialFn(
          validateZipFormat,
          formValues.country,
          partialFn_
        ),
        errorMessage: "Invalid zip code format for selected country",
      },
    ],
  },
};

const isStateRequired = (country, state) => {
  if (country === "US") {
    return state && state.trim().length > 0;
  }
  return true; // State not required for non-US
};

const validateZipFormat = (country, zipCode) => {
  if (!zipCode) return true; // Optional field

  if (country === "US") {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  } else if (country === "CA") {
    return /^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(zipCode);
  }
  return true; // Accept any format for other countries
};
```

#### How partialFn Works

`partialFn` is a partial application function with generic parameter replacement. It uses placeholders (`partialFn_`) to create validation functions on the fly:

```tsx
// This creates a validation function that checks if both dates are entered
partialFn(areBothDatesEntered, partialFn_, formValues.endDate)

// Becomes equivalent to:
(startDateValue) => areBothDatesEntered(startDateValue, formValues.endDate)
```

#### Password Confirmation Example

Perfect for registration forms where users must confirm their password:

```tsx
const isPasswordMatch = (originalPassword, confirmPassword) => {
  if (!confirmPassword) return true; // Don't validate empty confirm field
  return originalPassword === confirmPassword;
};

const validationOptions = {
  password: {
    validations: [
      {
        isValid: (value) => value && value.length >= 8,
        errorMessage: "Password must be at least 8 characters",
      },
      {
        isValid: (value) => value && /[A-Z]/.test(value),
        errorMessage: "Password must contain uppercase letter",
      },
      {
        isValid: (value) => value && /[a-z]/.test(value),
        errorMessage: "Password must contain lowercase letter",
      },
      {
        isValid: (value) => value && /\d/.test(value),
        errorMessage: "Password must contain a number",
      },
    ],
    relatedFields: ["confirmPassword"], // Re-validate confirmation when password changes
  },
  confirmPassword: {
    validations: [
      {
        isValid: (value) => value && value.trim().length > 0,
        errorMessage: "Please confirm your password",
      },
      {
        isValid: partialFn(isPasswordMatch, formValues.password, partialFn_),
        errorMessage: "Passwords do not match",
      },
    ],
  },
};
```

**Key Benefits:**

- Password has complex validation rules (length, character requirements)
- When password changes, confirmation is automatically re-validated
- Confirmation uses `partialFn` to compare against current password value
- Immediate feedback as user types

#### Address Validation Example

Perfect for complex address validation with country-dependent rules:

```tsx
const validationOptions = {
  country: {
    validations: [
      {
        isValid: (value) => value && value.trim().length > 0,
        errorMessage: "Country is required",
      },
    ],
    relatedFields: ["street", "city", "state", "zipCode"],
  },
  street: {
    validations: [
      {
        isValid: partialFn(isStreetRequired, formValues.country, partialFn_),
        errorMessage: "Street address is required",
      },
    ],
  },
  state: {
    validations: [
      {
        isValid: partialFn(isStateRequired, formValues.country, partialFn_),
        errorMessage: "State is required for US and Canadian addresses",
      },
      {
        isValid: partialFn(
          validateStateFormat,
          formValues.country,
          partialFn_
        ),
        errorMessage: "Invalid state format",
      },
    ],
    relatedFields: ["zipCode"],
  },
  zipCode: {
    validations: [
      {
        isValid: partialFn(
          validateZipFormat,
          formValues.country,
          partialFn_
        ),
        errorMessage: "Invalid postal code format for selected country",
      },
    ],
  },
};

const isStateRequired = (country, state) => {
  if (country === "US" || country === "CA") {
    return state && state.trim().length > 0;
  }
  return true; // State not required for other countries
};

const validateZipFormat = (country, zipCode) => {
  if (!zipCode) return true; // Optional field

  if (country === "US") {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  } else if (country === "CA") {
    return /^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(zipCode);
  }
  return true; // Accept any format for other countries
};
```

### Nested Field Support with `nestedFieldOf`

Use `nestedFieldOf` when you have auxiliary inputs (like hour, minute, second) that should validate against a main field (like date). This is perfect for complex inputs that are split across multiple form elements but represent a single logical value.

```tsx
const validationOptions = {
  // Main field with validation rules
  selectedDateTime: {
    validations: [
      {
        isValid: (value) => value && value.trim().length > 0,
        errorMessage: "Date and time is required",
      },
      {
        isValid: (value) => {
          if (!value) return true;
          const date = new Date(value);
          return date > new Date();
        },
        errorMessage: "Date must be in the future",
      },
    ],
    relatedFields: ["endDateTime"], // Can still have related fields
  },

  // Auxiliary inputs that validate the main field
  dateInput: {
    nestedFieldOf: "selectedDateTime", // Validates selectedDateTime when changed
  },
  hourInput: {
    nestedFieldOf: "selectedDateTime", // Also validates selectedDateTime
  },
  minuteInput: {
    nestedFieldOf: "selectedDateTime", // Also validates selectedDateTime
  },
};

// When any auxiliary input changes, selectedDateTime gets validated
// Errors appear under the 'selectedDateTime' key, not the auxiliary field keys
```

**Important**: `nestedFieldOf` and `relatedFields` are mutually exclusive. A field can either:

- Be an auxiliary input (`nestedFieldOf`) that validates a main field, OR
- Be a primary field (`relatedFields`) that affects other primary fields

Attempting to use both will throw an error in development mode.

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

## License

MIT
