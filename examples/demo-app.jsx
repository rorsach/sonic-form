import React, { useState } from 'react';
import { 
  useForm,
  isAsciiAlphanumeric,
  isInTheFuture,
  areDateFieldsPaired,
  isAfter,
  partialFnWithFields, 
  partialFn_
} from '../src/index';
import './index.css';

const DemoApp = () => {
  // Basic form state
  const [basicFormValues, setBasicFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    age: ''
  });
  const [basicErrors, setBasicErrors] = useState({});

  // Advanced form state  
  const [advancedFormValues, setAdvancedFormValues] = useState({
    startDate: '',
    endDate: '',
    futureDate: ''
  });
  const [advancedErrors, setAdvancedErrors] = useState({});

  // Basic form validation configuration
  const basicValidationOptions = {
    email: {
      validations: [
        {
          isValid: (value) => value && value.trim().length > 0,
          errorMessage: 'Email is required'
        },
        {
          isValid: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          errorMessage: 'Please enter a valid email address'
        }
      ]
    },
    password: {
      validations: [
        {
          isValid: (value) => value && value.length >= 8,
          errorMessage: 'Password must be at least 8 characters'
        },
        {
          isValid: (value) => !value || /[A-Z]/.test(value),
          errorMessage: 'Password must contain at least one uppercase letter'
        },
        {
          isValid: (value) => !value || /[0-9]/.test(value),
          errorMessage: 'Password must contain at least one number'
        }
      ],
      relatedFields: ['confirmPassword'] // Re-validate confirmation when password changes
    },
    confirmPassword: {
      validations: [
        {
          isValid: (value) => value && value.trim().length > 0,
          errorMessage: 'Please confirm your password'
        },
        {
          isValid: (value) => {
            if (!value) return true; // Don't validate empty confirm field
            return basicFormValues.password === value;
          },
          errorMessage: 'Passwords do not match'
        }
      ]
    },
    username: {
      validations: [
        {
          isValid: (value) => value && value.trim().length > 0,
          errorMessage: 'Username is required'
        },
        {
          isValid: (value) => !value || value.length >= 3,
          errorMessage: 'Username must be at least 3 characters'
        },
        {
          isValid: (value) => !value || isAsciiAlphanumeric(value),
          errorMessage: 'Username can only contain letters and numbers'
        }
      ]
    },
    age: {
      validations: [
        {
          isValid: (value) => value && value.trim().length > 0,
          errorMessage: 'Age is required'
        },
        {
          isValid: (value) => !value || /^\d+$/.test(value),
          errorMessage: 'Age must be a number'
        },
        {
          isValid: (value) => !value || (parseInt(value) >= 13 && parseInt(value) <= 120),
          errorMessage: 'Age must be between 13 and 120'
        }
      ]
    }
  };

  // Advanced form with cross-field validation
  const advancedValidationOptions = {
    startDate: {
      validations: [
        {
          isValid: partialFnWithFields(areDateFieldsPaired, partialFn_, '@endDate'),
          errorMessage: 'If start date is entered, end date is also required'
        }
      ],
      relatedFields: ['endDate']
    },
    endDate: {
      validations: [
        {
          isValid: partialFnWithFields(areDateFieldsPaired, '@startDate', partialFn_),
          errorMessage: 'If end date is entered, start date is also required'
        },
        {
          isValid: partialFnWithFields(isAfter, partialFn_, '@startDate'),
          errorMessage: 'End date must be after start date'
        }
      ],
      relatedFields: ['startDate']
    },
    futureDate: {
      validations: [
        {
          isValid: (value) => !value || isInTheFuture(value),
          errorMessage: 'Date must be in the future'
        }
      ]
    }
  };

  // Initialize forms
  const basicForm = useForm({
    formValues: basicFormValues,
    setFormValues: setBasicFormValues,
    errors: basicErrors,
    setErrors: setBasicErrors,
    validationOptions: basicValidationOptions
  });

  const advancedForm = useForm({
    formValues: advancedFormValues,
    setFormValues: setAdvancedFormValues,
    errors: advancedErrors,
    setErrors: setAdvancedErrors,
    validationOptions: advancedValidationOptions
  });

  const handleBasicSubmit = async (event) => {
    const isValid = await basicForm.handleSubmit(event);
    if (isValid) {
      alert('Basic form submitted successfully!');
      console.log('Basic form data:', basicFormValues);
    }
  };

  const handleAdvancedSubmit = async (event) => {
    const isValid = await advancedForm.handleSubmit(event);
    if (isValid) {
      alert('Advanced form submitted successfully!');
      console.log('Advanced form data:', advancedFormValues);
    }
  };

  return (
    <div className="app">
      <h1>Sonic Form Validation Test Harness</h1>
      
      {/* Basic Form */}
      <div className="form-section">
        <h2>Basic Form Validation</h2>
        <form onSubmit={handleBasicSubmit} className="form">
          <div className="field">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={basicFormValues.email}
              onChange={basicForm.handleChange}
              onBlur={basicForm.handleBlur}
              placeholder="Enter your email"
            />
            {basicErrors.email && <span className="error">{basicErrors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              value={basicFormValues.password}
              onChange={basicForm.handleChange}
              onBlur={basicForm.handleBlur}
              placeholder="Enter your password"
            />
            {basicErrors.password && <span className="error">{basicErrors.password}</span>}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={basicFormValues.confirmPassword}
              onChange={basicForm.handleChange}
              onBlur={basicForm.handleBlur}
              placeholder="Confirm your password"
            />
            {basicErrors.confirmPassword && <span className="error">{basicErrors.confirmPassword}</span>}
          </div>

          <div className="field">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              value={basicFormValues.username}
              onChange={basicForm.handleChange}
              onBlur={basicForm.handleBlur}
              placeholder="Enter your username"
            />
            {basicErrors.username && <span className="error">{basicErrors.username}</span>}
          </div>

          <div className="field">
            <label htmlFor="age">Age:</label>
            <input
              id="age"
              name="age"
              type="text"
              value={basicFormValues.age}
              onChange={basicForm.handleChange}
              onBlur={basicForm.handleBlur}
              placeholder="Enter your age"
            />
            {basicErrors.age && <span className="error">{basicErrors.age}</span>}
          </div>

          <button type="submit" className="submit-btn">Submit Basic Form</button>
        </form>
      </div>

      {/* Advanced Form */}
      <div className="form-section">
        <h2>Advanced Cross-Field Validation</h2>
        <form onSubmit={handleAdvancedSubmit} className="form">
          <div className="field">
            <label htmlFor="startDate">Start Date:</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={advancedFormValues.startDate}
              onChange={advancedForm.handleChange}
              onBlur={advancedForm.handleBlur}
            />
            {advancedErrors.startDate && <span className="error">{advancedErrors.startDate}</span>}
          </div>

          <div className="field">
            <label htmlFor="endDate">End Date:</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={advancedFormValues.endDate}
              onChange={advancedForm.handleChange}
              onBlur={advancedForm.handleBlur}
            />
            {advancedErrors.endDate && <span className="error">{advancedErrors.endDate}</span>}
          </div>

          <div className="field">
            <label htmlFor="futureDate">Future Date:</label>
            <input
              id="futureDate"
              name="futureDate"
              type="date"
              value={advancedFormValues.futureDate}
              onChange={advancedForm.handleChange}
              onBlur={advancedForm.handleBlur}
            />
            {advancedErrors.futureDate && <span className="error">{advancedErrors.futureDate}</span>}
          </div>

          <button type="submit" className="submit-btn">Submit Advanced Form</button>
        </form>
      </div>

      {/* Form State Display */}
      <div className="debug-section">
        <h3>Form State (Debug)</h3>
        <div className="debug-panel">
          <h4>Basic Form Values:</h4>
          <pre>{JSON.stringify(basicFormValues, null, 2)}</pre>
          <h4>Basic Form Errors:</h4>
          <pre>{JSON.stringify(basicErrors, null, 2)}</pre>
        </div>
        <div className="debug-panel">
          <h4>Advanced Form Values:</h4>
          <pre>{JSON.stringify(advancedFormValues, null, 2)}</pre>
          <h4>Advanced Form Errors:</h4>
          <pre>{JSON.stringify(advancedErrors, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default DemoApp;
