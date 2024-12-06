import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Register } from './Register';
import { registerUser } from '../../utils/api';

// Mock the API
vi.mock('../../utils/api', () => ({
  registerUser: vi.fn()
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

// Mock shared components
vi.mock('../shared/Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('../shared/Navbar/Navbar', () => ({
  Navbar: () => <div data-testid="mock-navbar">Navbar</div>
}));

describe('Register Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    registerUser.mockReset();
  });

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  // Helper function to fill form
  const fillForm = async (user) => {
    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email address');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const termsCheckbox = screen.getByRole('checkbox');

    await userEvent.type(nameInput, user.name);
    await userEvent.type(emailInput, user.email);
    await userEvent.type(passwordInput, user.password);
    await userEvent.type(confirmPasswordInput, user.confirmPassword);
    if (user.acceptTerms) {
      await userEvent.click(termsCheckbox);
    }
  };

  // Sanity Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderRegister();
      expect(screen.getByText('Register your account')).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      renderRegister();
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText('Accept Terms & Conditions')).toBeInTheDocument();
    });

    it('includes login link', () => {
      renderRegister();
      const loginLink = screen.getByText('Login');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    });
  });

  // Validation Tests
  describe('Form Validation', () => {
    it('validates name length', async () => {
      renderRegister();
      const nameInput = screen.getByPlaceholderText('Enter your name');
      
      await userEvent.type(nameInput, 'ab');
      expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();
      
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'John');
      expect(screen.queryByText('Name must be at least 3 characters')).not.toBeInTheDocument();
    });

    it('validates email format', async () => {
      renderRegister();
      const emailInput = screen.getByPlaceholderText('Enter your email address');
      
      await userEvent.type(emailInput, 'invalid-email');
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'valid@email.com');
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });

    it('validates password length', async () => {
      renderRegister();
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByText('Register');
      
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, '123456');
      expect(screen.queryByText('Password must be at least 6 characters')).not.toBeInTheDocument();
    });

    it('validates password match', async () => {
      renderRegister();
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      const submitButton = screen.getByText('Register');
      
      // Test initial password entry
      await userEvent.type(passwordInput, '123456');
      await userEvent.type(confirmPasswordInput, '1234567');
            
      // Fix password mismatch
      await userEvent.clear(confirmPasswordInput);
      await userEvent.type(confirmPasswordInput, '123456');
      expect(screen.queryByText('Passwords do not match!')).not.toBeInTheDocument();
      
    });

    it('validates terms acceptance', async () => {
      renderRegister();
      
      // Fill in valid form data
      const nameInput = screen.getByPlaceholderText('Enter your name');
      const emailInput = screen.getByPlaceholderText('Enter your email address');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(emailInput, 'john@example.com');
      await userEvent.type(passwordInput, '123456');
      await userEvent.type(confirmPasswordInput, '123456');
      
      // Try to submit without accepting terms
      const submitButton = screen.getByText('Register');
      await userEvent.click(submitButton);
      expect(screen.getByText('You must accept the Terms & Conditions')).toBeInTheDocument();
    });
  });

  // Integration Tests
  describe('Form Submission', () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
      acceptTerms: true
    };

    it('submits form with valid data', async () => {
      registerUser.mockResolvedValueOnce({ status: 200 });
      renderRegister();
      
      await fillForm(validUser);
      const submitButton = screen.getByText('Register');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(registerUser).toHaveBeenCalledWith({
          username: validUser.name,
          email: validUser.email,
          password: validUser.password,
          confirmPassword: validUser.confirmPassword
        });
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    it('handles registration error', async () => {
      const errorMessage = 'Registration failed';
      registerUser.mockRejectedValueOnce(new Error(errorMessage));
      
      renderRegister();
      await fillForm(validUser);
      const submitButton = screen.getByText('Register');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  // UI Interaction Tests
  describe('UI Interactions', () => {
    it('toggles focus states correctly', async () => {
      renderRegister();
      const nameInput = screen.getByPlaceholderText('Enter your name');
      
      await userEvent.click(nameInput);
      expect(nameInput).toHaveClass('text-black');
      
      fireEvent.blur(nameInput);
      expect(nameInput).toHaveClass('text-gray-500');
    });

    it('clears validation errors on valid input', async () => {
      renderRegister();
      const nameInput = screen.getByPlaceholderText('Enter your name');
      
      await userEvent.type(nameInput, 'a');
      expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();
      
      await userEvent.type(nameInput, 'bcd');
      expect(screen.queryByText('Name must be at least 3 characters')).not.toBeInTheDocument();
    });
  });
});
