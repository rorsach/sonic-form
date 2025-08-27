import React, { useState } from "react";
import { 
  useForm, 
  isRequired, 
  isValidName, 
  hasMinLength, 
  hasMaxLength,
  isValidEmail,
  isValidUSPhone,
  isMinimumAge,
  isStrongPassword,
  isSameAs,
  isValidCreditCard,
  isValidCreditCardExpiry,
  isValidCVV,
  isOneOf,
  isInRange,
  isInteger,
  partialFn,
  partialFn_
} from "@rorsach/sonic-form";

const ImprovedValidatorsForm = () => {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    password: "",
    confirmPassword: "",
    accountType: "",
    creditScore: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});

  const validationOptions = {
    firstName: {
      validations: [
        {
          isValid: isRequired,
          errorMessage: "First name is required",
        },
        {
          isValid: isValidName,
          errorMessage: "Name can only contain letters, spaces, hyphens, and apostrophes",
        },
        {
          isValid: hasMinLength(2),
          errorMessage: "First name must be at least 2 characters",
        },
        {
          isValid: hasMaxLength(50),
          errorMessage: "First name cannot exceed 50 characters",
        },
      ],
    },
    lastName: {
      validations: [
        {
          isValid: isRequired,
          errorMessage: "Last name is required",
        },
        {
          isValid: isValidName,
          errorMessage: "Name can only contain letters, spaces, hyphens, and apostrophes",
        },
        {
          isValid: hasMinLength(2),
          errorMessage: "Last name must be at least 2 characters",
        },
        {
          isValid: hasMaxLength(50),
          errorMessage: "Last name cannot exceed 50 characters",
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
    phone: {
      validations: [
        {
          isValid: isRequired,
          errorMessage: "Phone number is required",
        },
        {
          isValid: isValidUSPhone,
          errorMessage: "Please enter a valid US phone number",
        },
      ],
    },
    age: {
      validations: [
        {
          isValid: isRequired,
          errorMessage: "Age is required",
        },
        {
          isValid: isInteger,
          errorMessage: "Age must be a whole number",
        },
        {
          isValid: isInRange(18, 120),
          errorMessage: "Age must be between 18 and 120",
        },
      ],
    },
    password: {
      validations: [
        {
          isValid: isRequired,
          errorMessage: "Password is required",
        },
        {
          isValid: isStrongPassword({
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSymbols: true
          }),
          errorMessage: "Password must be at least 8 characters with uppercase, lowercase, numbers, and symbols",
        },
      ],
      relatedFields: ["confirmPassword"],
    },
    confirmPassword: {
      validations: [
        {
          isValid: isRequired,
          errorMessage: "Please confirm your password",
        },
        {
          isValid: partialFn(isSameAs, formValues.password, partialFn_),
          errorMessage: "Passwords do not match",
        },
      ],
    },
    accountType: {
      validations: [
        {
          isValid: isRequired,
          errorMessage: "Please select an account type",
        },
        {
          isValid: isOneOf(["personal", "business", "premium"]),
          errorMessage: "Please select a valid account type",
        },
      ],
    },
    creditScore: {
      validations: [
        {
          isValid: isInteger,
          errorMessage: "Credit score must be a whole number",
        },
        {
          isValid: isInRange(300, 850),
          errorMessage: "Credit score must be between 300 and 850",
        },
      ],
    },
    cardNumber: {
      validations: [
        {
          isValid: isValidCreditCard,
          errorMessage: "Please enter a valid credit card number",
        },
      ],
    },
    expiryDate: {
      validations: [
        {
          isValid: isValidCreditCardExpiry,
          errorMessage: "Please enter a valid expiry date (MM/YY)",
        },
      ],
    },
    cvv: {
      validations: [
        {
          isValid: isValidCVV,
          errorMessage: "CVV must be 3-4 digits",
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
      alert("Form submitted successfully!");
    }
  };

  return (
    <form onSubmit={onFormSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Improved Validators Example</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>First Name *</label>
        <input
          name="firstName"
          value={formValues.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your first name"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.firstName && <div style={{ color: 'red', fontSize: '14px' }}>{errors.firstName}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Last Name *</label>
        <input
          name="lastName"
          value={formValues.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your last name"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.lastName && <div style={{ color: 'red', fontSize: '14px' }}>{errors.lastName}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your email"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.email && <div style={{ color: 'red', fontSize: '14px' }}>{errors.email}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={formValues.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="(555) 123-4567"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.phone && <div style={{ color: 'red', fontSize: '14px' }}>{errors.phone}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Age *</label>
        <input
          type="number"
          name="age"
          value={formValues.age}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your age"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.age && <div style={{ color: 'red', fontSize: '14px' }}>{errors.age}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Password *</label>
        <input
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Strong password required"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.password && <div style={{ color: 'red', fontSize: '14px' }}>{errors.password}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Confirm Password *</label>
        <input
          type="password"
          name="confirmPassword"
          value={formValues.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm your password"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.confirmPassword && <div style={{ color: 'red', fontSize: '14px' }}>{errors.confirmPassword}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Account Type *</label>
        <select
          name="accountType"
          value={formValues.accountType}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        >
          <option value="">Select account type</option>
          <option value="personal">Personal</option>
          <option value="business">Business</option>
          <option value="premium">Premium</option>
        </select>
        {errors.accountType && <div style={{ color: 'red', fontSize: '14px' }}>{errors.accountType}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Credit Score (Optional)</label>
        <input
          type="number"
          name="creditScore"
          value={formValues.creditScore}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="300-850"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.creditScore && <div style={{ color: 'red', fontSize: '14px' }}>{errors.creditScore}</div>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Credit Card Number (Optional)</label>
        <input
          name="cardNumber"
          value={formValues.cardNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="1234 5678 9012 3456"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        {errors.cardNumber && <div style={{ color: 'red', fontSize: '14px' }}>{errors.cardNumber}</div>}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <label>Expiry Date</label>
          <input
            name="expiryDate"
            value={formValues.expiryDate}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="MM/YY"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.expiryDate && <div style={{ color: 'red', fontSize: '14px' }}>{errors.expiryDate}</div>}
        </div>
        <div style={{ flex: 1 }}>
          <label>CVV</label>
          <input
            name="cvv"
            value={formValues.cvv}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="123"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {errors.cvv && <div style={{ color: 'red', fontSize: '14px' }}>{errors.cvv}</div>}
        </div>
      </div>

      <button 
        type="submit" 
        style={{ 
          backgroundColor: '#007bff', 
          color: 'white', 
          padding: '12px 24px', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Submit Form
      </button>
    </form>
  );
};

export default ImprovedValidatorsForm;
