import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';
import { loginUser } from '../../utils/api';
import { setToken } from '../../utils/authService';

// Mock the API and auth service
vi.mock('../../utils/api', () => ({
  loginUser: vi.fn()
}));

vi.mock('../../utils/authService', () => ({
  setToken: vi.fn()
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn()
  }
}));

// Mock the components
vi.mock('../shared/Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('../shared/Navbar/Navbar', () => ({
  Navbar: () => <div data-testid="mock-navbar">Navbar</div>
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  // Sanity Tests
  describe('Sanity Checks', () => {
    it('renders without crashing', () => {
      expect(() => renderLogin()).not.toThrow();
    });

    it('contains all required form elements', () => {
      renderLogin();
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
      expect(screen.getByTestId('username-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    it('has correct initial state', () => {
      renderLogin();
      expect(screen.getByTestId('username-input')).toHaveValue('');
      expect(screen.getByTestId('password-input')).toHaveValue('');
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  // Functional Tests
  describe('Form Interactions', () => {
    it('updates input values on change', async () => {
      renderLogin();
      
      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');

      await fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      await fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(usernameInput.value).toBe('testuser');
      expect(passwordInput.value).toBe('password123');
    });

    it('handles input focus states', () => {
      renderLogin();
      
      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');

      fireEvent.focus(usernameInput);
      expect(usernameInput.className).toContain('text-black');
      
      fireEvent.blur(usernameInput);
      expect(usernameInput.className).toContain('text-gray-500');

      fireEvent.focus(passwordInput);
      expect(passwordInput.className).toContain('text-black');
      
      fireEvent.blur(passwordInput);
      expect(passwordInput.className).toContain('text-gray-500');
    });
  });

  // Integration Tests
  describe('Form Submission', () => {
    it('handles successful login', async () => {
      const mockToken = 'mock-token';
      loginUser.mockResolvedValueOnce({ token: mockToken });
      
      renderLogin();
      
      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      await fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      await fireEvent.change(passwordInput, { target: { value: 'password123' } });
      await fireEvent.click(loginButton);

      await waitFor(() => {
        expect(loginUser).toHaveBeenCalledWith({
          username: 'testuser',
          password: 'password123'
        });
      });

      expect(setToken).toHaveBeenCalledWith(mockToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify({ name: 'testuser' })
      );
    });

    it('handles login error', async () => {
      const errorMessage = 'Invalid credentials';
      loginUser.mockRejectedValueOnce(new Error(errorMessage));
      
      renderLogin();
      
      const usernameInput = screen.getByTestId('username-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      await fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      await fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      await fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });
});
