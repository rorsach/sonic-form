import React, { useState } from 'react';
import { useForm } from '../src/index';

const BasicFormExample = () => {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
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
          isValid: (value) => value && value.length >= 8,
          errorMessage: 'Password must be at least 8 characters'
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
      console.log('Form submitted:', formValues);
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      <input
        name="email"
        value={formValues.email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email}</span>}
      
      <input
        name="password"
        type="password"
        value={formValues.password}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Password"
      />
      {errors.password && <span>{errors.password}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
};

export default BasicFormExample;
