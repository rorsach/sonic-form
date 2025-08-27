import React, { useState } from 'react';
import { useForm } from '@rorsach/sonic-form';
import { partialFn, partialFn_ } from '@rorsach/sonic-form';

// Custom validation functions for address fields
const isStateRequired = (country: string, state: string) => {
  if (country === 'US' || country === 'CA') {
    return state && state.trim().length > 0;
  }
  return true; // State not required for other countries
};

const validateZipFormat = (country: string, zipCode: string) => {
  if (!zipCode) return true; // Optional field
  
  if (country === 'US') {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  } else if (country === 'CA') {
    return /^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(zipCode.toUpperCase());
  } else if (country === 'UK') {
    return /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i.test(zipCode);
  }
  return true; // Accept any format for other countries
};

const isCityRequired = (country: string, city: string) => {
  // City is required for most countries
  return city && city.trim().length > 0;
};

const isStreet1Required = (country: string, street1: string) => {
  // Street address line 1 is required for most countries
  return street1 && street1.trim().length > 0;
};

const validateStateFormat = (country: string, state: string) => {
  if (!state) return true; // Optional for some countries
  
  if (country === 'US') {
    // Accept 2-letter state codes or full state names
    return /^[A-Z]{2}$/.test(state.toUpperCase()) || state.length > 2;
  } else if (country === 'CA') {
    // Canadian provinces
    const provinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];
    return provinces.includes(state.toUpperCase()) || state.length > 2;
  }
  return true; // Accept any format for other countries
};

const AddressForm = () => {
  const [formValues, setFormValues] = useState({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [errors, setErrors] = useState({});

  const validationOptions = {
    country: {
      validations: [
        {
          isValid: (value) => value && value.trim().length > 0,
          errorMessage: 'Country is required'
        }
      ],
      relatedFields: ['street1', 'city', 'state', 'zipCode'] // Country affects all other fields
    },
    
    street1: {
      validations: [
        {
          isValid: partialFn(isStreet1Required, formValues.country, partialFn_),
          errorMessage: 'Street address is required'
        }
      ]
    },

    street2: {
      // Street2 is optional - no validations needed
      validations: []
    },
    
    city: {
      validations: [
        {
          isValid: partialFn(isCityRequired, formValues.country, partialFn_),
          errorMessage: 'City is required'
        }
      ]
    },
    
    state: {
      validations: [
        {
          isValid: partialFn(isStateRequired, formValues.country, partialFn_),
          errorMessage: 'State/Province is required for US and Canadian addresses'
        },
        {
          isValid: partialFn(validateStateFormat, formValues.country, partialFn_),
          errorMessage: 'Invalid state/province format'
        }
      ],
      relatedFields: ['zipCode'] // State affects zip code validation
    },
    
    zipCode: {
      validations: [
        {
          isValid: partialFn(validateZipFormat, formValues.country, partialFn_),
          errorMessage: 'Invalid postal/zip code format for selected country'
        }
      ]
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
      console.log('Address submitted:', formValues);
      alert('Address validation successful!');
    } else {
      console.log('Validation errors:', errors);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Address Validation Example</h2>
      <form onSubmit={onFormSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="country">Country *</label>
          <select
            id="country"
            name="country"
            value={formValues.country}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
          </select>
          {errors.country && <div style={{ color: 'red', fontSize: '14px' }}>{errors.country}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="street1">Street Address Line 1 *</label>
          <input
            id="street1"
            name="street1"
            type="text"
            value={formValues.street1}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="123 Main Street"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.street1 && <div style={{ color: 'red', fontSize: '14px' }}>{errors.street1}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="street2">Street Address Line 2</label>
          <input
            id="street2"
            name="street2"
            type="text"
            value={formValues.street2}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Apt, Suite, Unit, etc. (optional)"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.street2 && <div style={{ color: 'red', fontSize: '14px' }}>{errors.street2}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="city">City *</label>
          <input
            id="city"
            name="city"
            type="text"
            value={formValues.city}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="New York"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.city && <div style={{ color: 'red', fontSize: '14px' }}>{errors.city}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="state">State/Province {(formValues.country === 'US' || formValues.country === 'CA') && '*'}</label>
          <input
            id="state"
            name="state"
            type="text"
            value={formValues.state}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={formValues.country === 'US' ? 'NY or New York' : formValues.country === 'CA' ? 'ON or Ontario' : 'State/Province'}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.state && <div style={{ color: 'red', fontSize: '14px' }}>{errors.state}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="zipCode">Postal/Zip Code</label>
          <input
            id="zipCode"
            name="zipCode"
            type="text"
            value={formValues.zipCode}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={
              formValues.country === 'US' ? '12345 or 12345-6789' :
              formValues.country === 'CA' ? 'K1A 0A6' :
              formValues.country === 'UK' ? 'M1 1AA' :
              'Postal/Zip Code'
            }
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
          {errors.zipCode && <div style={{ color: 'red', fontSize: '14px' }}>{errors.zipCode}</div>}
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
          Validate Address
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h3>Validation Rules:</h3>
        <ul>
          <li>Country is always required</li>
          <li>Street Address Line 1 and City are required for all countries</li>
          <li>Street Address Line 2 is optional</li>
          <li>State/Province is required for US and Canadian addresses</li>
          <li>Postal/Zip codes are validated based on country format:
            <ul>
              <li>US: 12345 or 12345-6789</li>
              <li>Canada: K1A 0A6</li>
              <li>UK: M1 1AA, SW1A 1AA, EC1A 1BB</li>
            </ul>
          </li>
          <li>Changing country re-validates all dependent fields</li>
          <li>Changing state re-validates zip code format</li>
        </ul>
      </div>
    </div>
  );
};

export default AddressForm;
