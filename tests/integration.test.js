import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DemoApp from '../examples/demo-app.jsx';
import BasicFormExample from '../examples/basic-form';

describe('Integration Tests - Complete Form Workflows', () => {
  describe('Test Harness App', () => {
    test('should render both basic and advanced forms', () => {
      render(<DemoApp />);
      
      expect(screen.getByText('Sonic Form Validation Test Harness')).toBeInTheDocument();
      expect(screen.getByText('Basic Form Validation')).toBeInTheDocument();
      expect(screen.getByText('Advanced Cross-Field Validation')).toBeInTheDocument();
    });

    test('should validate basic form fields on user interaction', async () => {
      const user = userEvent.setup();
      render(<DemoApp />);
      
      // Find form inputs
      const emailInput = screen.getByLabelText('Email:');
      const passwordInput = screen.getByLabelText('Password:');
      const usernameInput = screen.getByLabelText('Username:');
      const submitButton = screen.getByText('Submit Basic Form');

      // Test email validation
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Trigger blur
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });

      // Fix email
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });

      // Test password validation
      await user.type(passwordInput, 'short');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one number')).toBeInTheDocument();
      });

      // Test username validation with special characters
      await user.type(usernameInput, 'user@name');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Username can only contain letters and numbers')).toBeInTheDocument();
      });
    });

    test('should handle form submission with validation', async () => {
      const user = userEvent.setup();
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
      
      render(<DemoApp />);
      
      const emailInput = screen.getByLabelText('Email:');
      const passwordInput = screen.getByLabelText('Password:');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password:');
      const usernameInput = screen.getByLabelText('Username:');
      const ageInput = screen.getByLabelText('Age:');
      const submitButton = screen.getByText('Submit Basic Form');

      // Fill form with valid data
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.type(usernameInput, 'testuser');
      await user.type(ageInput, '25');

      // Submit form
      await user.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Basic form submitted successfully!');
      });

      alertSpy.mockRestore();
    });

    test('should prevent submission with invalid data', async () => {
      const user = userEvent.setup();
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
      
      render(<DemoApp />);
      
      const submitButton = screen.getByText('Submit Basic Form');

      // Try to submit empty form
      await user.click(submitButton);

      // Should show validation errors, not success alert
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
        expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
        expect(screen.getByText('Username is required')).toBeInTheDocument();
        expect(screen.getByText('Age is required')).toBeInTheDocument();
      });

      expect(alertSpy).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    test('should handle cross-field validation in advanced form', async () => {
      const user = userEvent.setup();
      render(<DemoApp />);
      
      const startDateInput = screen.getByLabelText('Start Date:');
      const endDateInput = screen.getByLabelText('End Date:');

      // Enter start date only
      await user.type(startDateInput, '2023-01-01');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('If start date is entered, end date is also required')).toBeInTheDocument();
      });

      // Enter end date
      await user.type(endDateInput, '2023-01-02');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText('If start date is entered, end date is also required')).not.toBeInTheDocument();
      });

      // Test end date before start date
      await user.clear(endDateInput);
      await user.type(endDateInput, '2022-12-31');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('End date must be after start date')).toBeInTheDocument();
      });
    });

    test('should validate future date field', async () => {
      const user = userEvent.setup();
      render(<DemoApp />);
      
      const futureDateInput = screen.getByLabelText('Future Date:');

      // Enter past date
      await user.type(futureDateInput, '2020-01-01');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Date must be in the future')).toBeInTheDocument();
      });

      // Enter future date
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      await user.clear(futureDateInput);
      await user.type(futureDateInput, futureDateString);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText('Date must be in the future')).not.toBeInTheDocument();
      });
    });
  });

  describe('Basic Form Example', () => {
    test('should render and validate basic form', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(<BasicFormExample />);
      
      const emailInput = screen.getByPlaceholderText('Email');
      const passwordInput = screen.getByPlaceholderText('Password');
      const submitButton = screen.getByText('Submit');

      // Test validation
      await user.type(emailInput, 'invalid');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument();
      });

      // Fix and submit
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', {
          email: 'test@example.com',
          password: 'password123'
        });
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Real User Workflows', () => {
    test('should handle rapid typing and validation', async () => {
      const user = userEvent.setup();
      render(<DemoApp />);
      
      const emailInput = screen.getByLabelText('Email:');
      
      // Type rapidly
      await user.type(emailInput, 'a');
      await user.type(emailInput, 'b');
      await user.type(emailInput, 'c');
      await user.type(emailInput, '@');
      await user.type(emailInput, 'test.com');
      
      await user.tab();
      
      // Should validate the final value
      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });
    });

    test('should handle copy-paste operations', async () => {
      const user = userEvent.setup();
      render(<DemoApp />);
      
      const emailInput = screen.getByLabelText('Email:');
      
      // Simulate paste operation
      await user.click(emailInput);
      await user.paste('copied@email.com');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });
    });

    test('should validate password confirmation', async () => {
      const user = userEvent.setup();
      render(<DemoApp />);
      
      const passwordInput = screen.getByLabelText('Password:');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password:');

      // Enter password
      await user.type(passwordInput, 'Password123');
      await user.tab();

      // Enter mismatched confirmation
      await user.type(confirmPasswordInput, 'DifferentPassword');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });

      // Fix confirmation to match
      await user.clear(confirmPasswordInput);
      await user.type(confirmPasswordInput, 'Password123');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
      });
    });

    test('should re-validate confirmation when password changes', async () => {
      const user = userEvent.setup();
      render(<DemoApp />);
      
      const passwordInput = screen.getByLabelText('Password:');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password:');

      // Set initial passwords
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');
      await user.tab();

      // No error should be present
      await waitFor(() => {
        expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
      });

      // Change confirmation password to something that doesn't match
      await user.clear(confirmPasswordInput);
      await user.type(confirmPasswordInput, 'DifferentPassword');
      await user.tab();
      
      // Should show error since passwords don't match
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });

      // Now change the main password to match the confirmation
      await user.clear(passwordInput);
      await user.type(passwordInput, 'DifferentPassword');
      await user.tab();
      
      // Error should be cleared since passwords now match
      await waitFor(() => {
        expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
      });
    });

    test('should handle form reset scenarios', async () => {
      const user = userEvent.setup();
      render(<DemoApp />);
      
      const emailInput = screen.getByLabelText('Email:');
      const passwordInput = screen.getByLabelText('Password:');
      
      // Fill form
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      
      // Clear form
      await user.clear(emailInput);
      await user.clear(passwordInput);
      await user.tab();
      
      // Should show required errors
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });
  });
});
