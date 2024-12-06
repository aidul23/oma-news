import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import Profile from './Profile';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signOut: vi.fn()
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
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

describe('Profile Component', () => {
  const mockNavigate = vi.fn();
  const mockSignOut = vi.fn();
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    profilePhoto: 'test-photo.jpg'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useLocation.mockReturnValue({ state: { user: mockUser } });
    useNavigate.mockReturnValue(mockNavigate);
    getAuth.mockReturnValue({});
    signOut.mockReturnValue(Promise.resolve());
  });

  const renderProfile = () => {
    return render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
  };

  // Sanity Checks
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderProfile();
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    });

    it('displays user information when provided', () => {
      renderProfile();
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      
      const profileImage = screen.getByAltText(mockUser.name);
      expect(profileImage).toBeInTheDocument();
      expect(profileImage).toHaveAttribute('src', mockUser.profilePhoto);
    });

    it('displays default values when user info is missing', () => {
      useLocation.mockReturnValue({ state: null });
      renderProfile();
      
      expect(screen.getByText('User Name')).toBeInTheDocument();
      const defaultImage = screen.getByAltText('Profile');
      expect(defaultImage).toHaveAttribute('src', expect.stringContaining('daisyui.com'));
    });
  });

  // Functionality Tests
  describe('User Actions', () => {
    it('handles logout successfully', async () => {
      signOut.mockResolvedValueOnce();
      renderProfile();
      
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('handles logout error gracefully', async () => {
      const mockError = new Error('Logout failed');
      signOut.mockRejectedValueOnce(mockError);
      const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      renderProfile();
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalled();
        expect(mockConsoleError).toHaveBeenCalledWith('Logout Error: ', mockError.message);
      });

      mockConsoleError.mockRestore();
    });

    it('clears localStorage on logout', async () => {
      const mockLocalStorage = {
        removeItem: vi.fn()
      };
      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage,
        writable: true
      });

      signOut.mockResolvedValueOnce();
      renderProfile();
      
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
      });
    });
  });

  // UI Elements
  describe('UI Elements', () => {
    it('displays edit profile button', () => {
      renderProfile();
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('displays additional information section', () => {
      renderProfile();
      expect(screen.getByText('Additional Information')).toBeInTheDocument();
    });

    it('has correct button styling', () => {
      renderProfile();
      const editButton = screen.getByText('Edit Profile');
      const logoutButton = screen.getByText('Logout');

      expect(editButton.className).toContain('bg-blue-500');
      expect(logoutButton.className).toContain('bg-red-500');
    });
  });
});
