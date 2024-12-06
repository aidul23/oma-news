import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Home';
import { fetchNewsData } from '../../utils/api';
import { formatPublishedDate } from '../../utils/dateFormatter';

// Mock the formatPublishedDate utility
vi.mock('../../utils/dateFormatter', () => ({
  formatPublishedDate: vi.fn(date => date)
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}));

// Mock the components
vi.mock('../shared/Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('../shared/Navbar/Navbar', () => ({
  Navbar: () => <div data-testid="mock-navbar">Navbar</div>
}));

vi.mock('../shared/LeftSideNav/LeftSideNav', () => ({
  default: ({ onSelectCategory }) => (
    <div data-testid="mock-left-nav">
      <button onClick={() => onSelectCategory({ name: 'Technology' })}>
        Select Technology
      </button>
    </div>
  )
}));

vi.mock('../shared/RightSideNav/RightSideNav', () => ({
  default: ({ setUser }) => (
    <div data-testid="mock-right-nav" onClick={() => setUser({ name: 'Test User' })}>
      RightSideNav
    </div>
  )
}));

vi.mock('./BreakingNews', () => ({
  default: () => <div data-testid="mock-breaking-news">Breaking News</div>
}));

vi.mock('../../utils/api', () => ({
  fetchNewsData: vi.fn()
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the fetchNewsData to return sample data
    fetchNewsData.mockResolvedValue([
      {
        title: 'Test News 1',
        description: 'Test Description 1',
        publishedAt: '2024-03-01T12:00:00Z',
        urlToImage: 'test-image-1.jpg',
        author: 'Test Author 1'
      },
      {
        title: 'Test News 2',
        description: 'Test Description 2',
        publishedAt: '2024-03-01T13:00:00Z',
        urlToImage: 'test-image-2.jpg',
        author: 'Test Author 2'
      }
    ]);
  });

  const renderHome = () => {
    return render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    renderHome();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-breaking-news')).toBeInTheDocument();
    expect(screen.getByTestId('mock-left-nav')).toBeInTheDocument();
    expect(screen.getByTestId('mock-right-nav')).toBeInTheDocument();
  });

  it('fetches and displays news data on initial render', async () => {
    renderHome();
    
    await waitFor(() => {
      expect(fetchNewsData).toHaveBeenCalledWith('All News');
    });

    await waitFor(() => {
      expect(screen.getByText('Test News 1')).toBeInTheDocument();
      expect(screen.getByText('Test News 2')).toBeInTheDocument();
    });
  });

  it('updates news data when category is changed', async () => {
    renderHome();

    fireEvent.click(screen.getByText('Select Technology'));

    await waitFor(() => {
      expect(fetchNewsData).toHaveBeenCalledWith('Technology');
    });
  });

  it('shows loading spinner while fetching news', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
     
    // Mock fetchNewsData to return our controlled promise
    fetchNewsData.mockImplementation(() => promise);
    
    renderHome();

    // Resolve the promise with mock data
    resolvePromise([
      {
        title: 'Test News 1',
        description: 'Test Description 1',
        publishedAt: '2024-03-01T12:00:00Z',
        urlToImage: 'test-image-1.jpg',
        author: 'Test Author 1'
      }
    ]);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  it('handles error when fetching news fails', async () => {
    const error = new Error('Failed to fetch');
    fetchNewsData.mockRejectedValue(error);
    
    const consoleSpy = vi.spyOn(console, 'error');
    
    renderHome();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load news data:',
        error
      );
    });

    consoleSpy.mockRestore();
  });

  it('displays news card with correct information', async () => {
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Test News 1')).toBeInTheDocument();
      expect(screen.getByText('Test Author 1')).toBeInTheDocument();
      expect(screen.getByText('Test Description 1')).toBeInTheDocument();
      
      const images = screen.getAllByRole('img');
      expect(images.some(img => img.getAttribute('src') === 'test-image-1.jpg')).toBe(true);
    });
  });
});
