import React, { useState } from 'react';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../lib/useForm';

describe('useForm', () => {
  let initialFormValues;
  let initialErrors;
  let validationOptions;

  beforeEach(() => {
    initialFormValues = { email: '', password: '' };
    initialErrors = {};
    validationOptions = {
      email: {
        validations: [
          {
            isValid: (value) => value && value.trim().length > 0,
            errorMessage: 'Email is required',
          },
          {
            isValid: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            errorMessage: 'Invalid email format',
          },
        ],
      },
      password: {
        validations: [
          {
            isValid: (value) => value && value.length >= 8,
            errorMessage: 'Password must be at least 8 characters',
          },
        ],
      },
    };
  });

  const setupHook = (customFormValues = initialFormValues, customErrors = initialErrors, customValidationOptions = validationOptions) => {
    return renderHook(() => {
      const [formValues, setFormValues] = useState(customFormValues);
      const [errors, setErrors] = useState(customErrors);
      
      const form = useForm({
        formValues,
        setFormValues,
        errors,
        setErrors,
        validationOptions: customValidationOptions,
      });

      return { formValues, setFormValues, errors, setErrors, ...form };
    });
  };

  test('should return all required event handlers', () => {
    const { result } = setupHook();

    expect(result.current).toHaveProperty('handleChange');
    expect(result.current).toHaveProperty('handleBlur');
    expect(result.current).toHaveProperty('handleSubmit');
    expect(result.current).toHaveProperty('handleDatePickerChange');
    expect(result.current).toHaveProperty('handleDropdownChange');
    expect(result.current).toHaveProperty('handleCustomChange');
    expect(result.current).toHaveProperty('validateAll');
  });

  test('handleChange should update form values and validate', async () => {
    const { result } = setupHook();

    const mockEvent = {
      target: {
        name: 'email',
        value: 'test@example.com',
      },
    };

    await act(async () => {
      result.current.handleChange(mockEvent);
    });

    // Check that form value was updated
    expect(result.current.formValues.email).toBe('test@example.com');
    
    // Check that validation passed (no error)
    expect(result.current.errors.email).toBe('');
  });

  test('handleChange should show validation errors for invalid input', async () => {
    const { result } = setupHook();

    const mockEvent = {
      target: {
        name: 'email',
        value: 'invalid-email',
      },
    };

    await act(async () => {
      result.current.handleChange(mockEvent);
    });

    // Check that form value was updated
    expect(result.current.formValues.email).toBe('invalid-email');
    
    // Check that validation failed (shows the last failing validation)
    expect(result.current.errors.email).toBe('Invalid email format');
  });

  test('handleChange should show first validation error for empty input', async () => {
    const { result } = setupHook();

    const mockEvent = {
      target: {
        name: 'email',
        value: '',
      },
    };

    await act(async () => {
      result.current.handleChange(mockEvent);
    });

    // Check that form value was updated
    expect(result.current.formValues.email).toBe('');
    
    // For empty string: first validation fails, second passes (because !value is true)
    // So we should see the first validation error
    expect(result.current.errors.email).toBe('Email is required');
  });

  test('handleBlur should validate field', async () => {
    const { result } = setupHook();

    const mockEvent = {
      target: {
        name: 'email',
        value: '',
      },
    };

    await act(async () => {
      result.current.handleBlur(mockEvent);
    });

    // Should show required error
    expect(result.current.errors.email).toBe('Email is required');
  });

  test('handleSubmit should prevent default and validate all fields', async () => {
    const { result } = setupHook();

    const mockEvent = {
      preventDefault: jest.fn(),
    };

    let isValid;
    await act(async () => {
      isValid = await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(isValid).toBe(false); // Should be false because form values are empty
    
    // Should have validation errors
    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password must be at least 8 characters');
  });

  test('handleSubmit should return true for valid form', async () => {
    const { result } = setupHook({ email: 'test@example.com', password: 'password123' });

    const mockEvent = {
      preventDefault: jest.fn(),
    };

    let isValid;
    await act(async () => {
      isValid = await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(isValid).toBe(true);
    
    // Should have no validation errors
    expect(result.current.errors.email).toBe('');
    expect(result.current.errors.password).toBe('');
  });

  test('validateAll should validate all fields', async () => {
    const { result } = setupHook();

    let isValid;
    await act(async () => {
      isValid = await result.current.validateAll();
    });

    expect(isValid).toBe(false);
    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password must be at least 8 characters');
  });

  test('handleCustomChange should update form values', async () => {
    const { result } = setupHook();

    await act(async () => {
      result.current.handleCustomChange('email', 'test@example.com');
    });

    expect(result.current.formValues.email).toBe('test@example.com');
  });

  test('should handle fields with relatedFields', async () => {
    const validationOptionsWithRelated = {
      startDate: {
        validations: [
          {
            isValid: (value) => value && value.trim().length > 0,
            errorMessage: 'Start date is required',
          },
        ],
        relatedFields: ['endDate'],
      },
      endDate: {
        validations: [
          {
            isValid: (value) => value && value.trim().length > 0,
            errorMessage: 'End date is required',
          },
        ],
      },
    };

    const { result } = setupHook(
      { startDate: '', endDate: '' },
      { endDate: 'End date is required' }, // endDate has existing error
      validationOptionsWithRelated
    );

    const mockEvent = {
      target: {
        name: 'startDate',
        value: '2023-01-01',
      },
    };

    await act(async () => {
      result.current.handleChange(mockEvent);
    });

    // startDate should be updated
    expect(result.current.formValues.startDate).toBe('2023-01-01');
    
    // endDate should be re-validated because it had an existing error
    expect(result.current.errors.endDate).toBe('End date is required');
  });

  test('should handle nestedFieldOf validation', async () => {
    const validationOptionsWithNested = {
      selectedDateTime: {
        validations: [
          {
            isValid: (value) => value && value.trim().length > 0,
            errorMessage: 'Date and time is required',
          },
        ],
      },
      dateInput: {
        nestedFieldOf: 'selectedDateTime',
      },
    };

    const { result } = setupHook(
      { selectedDateTime: '', dateInput: '' },
      {},
      validationOptionsWithNested
    );

    const mockEvent = {
      target: {
        name: 'dateInput',
        value: '2023-01-01',
      },
    };

    await act(async () => {
      result.current.handleChange(mockEvent);
    });

    // dateInput should be updated
    expect(result.current.formValues.dateInput).toBe('2023-01-01');
    
    // selectedDateTime should be validated (and should have error because it's still empty)
    expect(result.current.errors.selectedDateTime).toBe('Date and time is required');
  });

  test('should handle dropdown change events', async () => {
    const { result } = setupHook();

    const mockEvent = {
      target: {
        name: 'email',
        value: 'test@example.com',
      },
    };

    await act(async () => {
      result.current.handleDropdownChange(mockEvent);
    });

    expect(result.current.formValues.email).toBe('test@example.com');
    expect(result.current.errors.email).toBe('');
  });

  test('should handle date picker change events', async () => {
    const { result } = setupHook();

    const mockEvent = {
      target: {
        name: 'selectedDate',
      },
      detail: '2023-01-01',
    };

    await act(async () => {
      result.current.handleDatePickerChange(mockEvent);
    });

    expect(result.current.formValues.selectedDate).toEqual(new Date('2023-01-01'));
  });

  test('should handle async validation functions', async () => {
    const asyncValidationOptions = {
      email: {
        validations: [
          {
            isValid: async (value) => {
              return new Promise((resolve) => {
                setTimeout(() => resolve(value === 'valid@example.com'), 10);
              });
            },
            errorMessage: 'Email is not valid',
          },
        ],
      },
    };

    const { result } = setupHook(
      { email: 'invalid@example.com' },
      {},
      asyncValidationOptions
    );

    let isValid;
    await act(async () => {
      isValid = await result.current.validateAll();
    });

    expect(isValid).toBe(false);
    expect(result.current.errors.email).toBe('Email is not valid');
  });

  test('validation should clear errors when input becomes valid', async () => {
    const { result } = setupHook();

    // First, create an error with invalid format
    const invalidEvent = {
      target: {
        name: 'email',
        value: 'invalid-email',
      },
    };

    await act(async () => {
      result.current.handleChange(invalidEvent);
    });

    expect(result.current.errors.email).toBe('Invalid email format');

    // Then, fix the input
    const validEvent = {
      target: {
        name: 'email',
        value: 'valid@example.com',
      },
    };

    await act(async () => {
      result.current.handleChange(validEvent);
    });

    expect(result.current.errors.email).toBe('');
  });

  // Error handling tests
  test('should handle events without name attribute', async () => {
    const { result } = setupHook();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const eventWithoutName = {
      target: {
        name: null,
        getAttribute: () => null,
        value: 'test',
      },
    };

    await act(async () => {
      result.current.handleChange(eventWithoutName);
    });

    expect(consoleSpy).toHaveBeenCalledWith('You must specify a name for this form field.');
    consoleSpy.mockRestore();
  });

  test('should handle events with undefined value', async () => {
    const { result } = setupHook();
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const eventWithUndefinedValue = {
      target: {
        name: 'email',
        value: undefined,
      },
    };

    await act(async () => {
      result.current.handleChange(eventWithUndefinedValue);
    });

    expect(consoleSpy).toHaveBeenCalledWith('The changeEvent value of email is undefined. Was it a programmatic event?');
    consoleSpy.mockRestore();
  });

  test('should handle validation function that throws an error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const validationOptionsWithError = {
      email: {
        validations: [
          {
            isValid: () => {
              throw new Error('Validation function error');
            },
            errorMessage: 'Custom error message',
          },
        ],
      },
    };

    const { result } = setupHook({}, {}, validationOptionsWithError);

    await act(async () => {
      const isValid = await result.current.validateAll();
      expect(isValid).toBe(false);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Validation error for email:', expect.any(Error));
    expect(result.current.errors.email).toBe('Custom error message');
    
    consoleSpy.mockRestore();
  });

  test('should handle validation function that throws without error message', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const validationOptionsWithError = {
      email: {
        validations: [
          {
            isValid: () => {
              throw new Error('Validation function error');
            },
            // No errorMessage provided
          },
        ],
      },
    };

    const { result } = setupHook({}, {}, validationOptionsWithError);

    await act(async () => {
      const isValid = await result.current.validateAll();
      expect(isValid).toBe(false);
    });

    expect(result.current.errors.email).toBe('Validation failed');
    consoleSpy.mockRestore();
  });

  test('should throw error for mutually exclusive nestedFieldOf and relatedFields', () => {
    // Set NODE_ENV to development to trigger the check
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const invalidValidationOptions = {
      testField: {
        nestedFieldOf: 'mainField',
        relatedFields: ['otherField'], // This should cause an error
      },
    };

    expect(() => {
      renderHook(() => {
        const [formValues, setFormValues] = useState({});
        const [errors, setErrors] = useState({});
        
        const form = useForm({
          formValues,
          setFormValues,
          errors,
          setErrors,
          validationOptions: invalidValidationOptions,
        });

        // Try to trigger the validation
        const mockEvent = {
          target: {
            name: 'testField',
            value: 'test',
          },
        };
        
        form.handleChange(mockEvent);
        return form;
      });
    }).toThrow(/cannot define both "nestedFieldOf" and "relatedFields"/);

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  test('should handle date picker events without detail', async () => {
    const { result } = setupHook();

    const eventWithoutDetail = {
      target: {
        name: 'selectedDate',
      },
      // No detail property
    };

    await act(async () => {
      result.current.handleDatePickerChange(eventWithoutDetail);
    });

    // Should not crash and should not update form values
    expect(result.current.formValues.selectedDate).toBeUndefined();
  });

  test('should handle events using getAttribute for name', async () => {
    const { result } = setupHook();

    const eventWithGetAttribute = {
      target: {
        name: null, // name is null
        getAttribute: (attr) => attr === 'name' ? 'email' : null,
        value: 'test@example.com',
      },
    };

    await act(async () => {
      result.current.handleChange(eventWithGetAttribute);
    });

    expect(result.current.formValues.email).toBe('test@example.com');
  });

  test('should handle validateRelatedFields when getFieldName returns null', async () => {
    const { result } = setupHook();

    const eventWithoutName = {
      target: {
        name: null,
        getAttribute: () => null,
        value: 'test',
      },
    };

    // This should not crash even though getFieldName returns null
    await act(async () => {
      // Call validateRelatedFields indirectly through handleChange
      result.current.handleChange(eventWithoutName);
    });

    // Should not have updated any values since name was null
    expect(result.current.formValues).toEqual({ email: '', password: '' });
  });
});
