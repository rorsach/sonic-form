import React, { useState } from 'react';
import { useForm } from '../lib/useForm';
import { partialFn, partialFn_ } from '../lib/partialFn';

// Custom validation functions for password confirmation
const isPasswordMatch = (originalPassword: string, confirmPassword: string) => {
  if (!confirmPassword) return true; // Don't validate empty confirm field
  return originalPassword === confirmPassword;
};

const isPasswordRequired = (password: string) => {
  return password && password.trim().length > 0;
};

const hasMinLength = (password: string) => {
  return password && password.length >= 8;
};

const hasUppercase = (password: string) => {
  return password && /[A-Z]/.test(password);
};

const hasLowercase = (password: string) => {
  return password && /[a-z]/.test(password);
};

const hasNumber = (password: string) => {
  return password && /\d/.test(password);
};

const hasSpecialChar = (password: string) => {
  return password && /[!@#$%^&*(),.?":{}|<>]/.test(password);
};

const PasswordConfirmationForm = () => {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validationOptions = {
    email: {
      validations: [
        {
          isValid: (value) => value && value.trim().length > 0,
          errorMessage: 'Email is required'
        },
        {
          isValid: (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          errorMessage: 'Invalid email format'
        }
      ]
    },
    
    password: {
      validations: [
        {
          isValid: isPasswordRequired,
          errorMessage: 'Password is required'
        },
        {
          isValid: hasMinLength,
          errorMessage: 'Password must be at least 8 characters'
        },
        {
          isValid: hasUppercase,
          errorMessage: 'Password must contain at least one uppercase letter'
        },
        {
          isValid: hasLowercase,
          errorMessage: 'Password must contain at least one lowercase letter'
        },
        {
          isValid: hasNumber,
          errorMessage: 'Password must contain at least one number'
        },
        {
          isValid: hasSpecialChar,
          errorMessage: 'Password must contain at least one special character'
        }
      ],
      relatedFields: ['confirmPassword'] // When password changes, re-validate confirmation
    },
    
    confirmPassword: {
      validations: [
        {
          isValid: (value) => value && value.trim().length > 0,
          errorMessage: 'Please confirm your password'
        },
        {
          isValid: partialFn(isPasswordMatch, formValues.password, partialFn_),
          errorMessage: 'Passwords do not match'
        }
      ],
      relatedFields: ['password'] // When confirm changes, could re-validate password if needed
    }
  };

  const { handleChange, handleBlur, handleSubmit } = useForm({
    formValues,
    setFormValues,
    errors,
    setErrors,
    validationOptions
  });

  const onFormSubmit = async (event) => {
    const isValid = await handleSubmit(event);
    if (isValid) {
      console.log('Registration successful:', { 
        email: formValues.email, 
        password: '[HIDDEN]' 
      });
      alert('Registration successful!');
    } else {
      console.log('Validation errors:', errors);
    }
  };

  const getPasswordStrength = () => {
    const { password } = formValues;
    if (!password) return { strength: 0, label: '' };
    
    let score = 0;
    if (hasMinLength(password)) score++;
    if (hasUppercase(password)) score++;
    if (hasLowercase(password)) score++;
    if (hasNumber(password)) score++;
    if (hasSpecialChar(password)) score++;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#ff4444', '#ff8800', '#ffaa00', '#88aa00', '#00aa00'];
    
    return {
      strength: score,
      label: labels[score] || '',
      color: colors[score] || '#ccc'
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Password Confirmation Example</h2>
      <form onSubmit={onFormSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="user@example.com"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.email && <div style={{ color: 'red', fontSize: '14px' }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password *</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter password"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.password && <div style={{ color: 'red', fontSize: '14px' }}>{errors.password}</div>}
          
          {/* Password strength indicator */}
          {formValues.password && (
            <div style={{ marginTop: '5px' }}>
              <div style={{ fontSize: '12px', marginBottom: '3px' }}>
                Password Strength: <span style={{ color: passwordStrength.color, fontWeight: 'bold' }}>
                  {passwordStrength.label}
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: '#eee', 
                borderRadius: '2px' 
              }}>
                <div style={{
                  width: `${(passwordStrength.strength / 5) * 100}%`,
                  height: '100%',
                  backgroundColor: passwordStrength.color,
                  borderRadius: '2px',
                  transition: 'all 0.3s ease'
                }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formValues.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirm password"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.confirmPassword && <div style={{ color: 'red', fontSize: '14px' }}>{errors.confirmPassword}</div>}
          
          {/* Match indicator */}
          {formValues.confirmPassword && formValues.password && (
            <div style={{ 
              marginTop: '5px', 
              fontSize: '12px',
              color: formValues.password === formValues.confirmPassword ? 'green' : 'red'
            }}>
              {formValues.password === formValues.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h3>Password Requirements:</h3>
        <ul>
          <li>At least 8 characters long</li>
          <li>Contains uppercase letter (A-Z)</li>
          <li>Contains lowercase letter (a-z)</li>
          <li>Contains number (0-9)</li>
          <li>Contains special character (!@#$%^&*)</li>
          <li>Confirmation must match original password</li>
        </ul>
        
        <h3>Validation Behavior:</h3>
        <ul>
          <li>Password validates immediately as you type</li>
          <li>When password changes, confirmation is re-validated (if it has errors)</li>
          <li>When confirmation changes, it's validated against current password</li>
          <li>Visual feedback shows password strength and match status</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordConfirmationForm;
