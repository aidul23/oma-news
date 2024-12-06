import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import NewsPage from './NewsPage';
import { markArticleAsRead } from '../../utils/api';

// Mock the API
vi.mock('../../utils/api', () => ({
  markArticleAsRead: vi.fn()
}));

// Mock the components
vi.mock('../shared/Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('../shared/Navbar/Navbar', () => ({
  Navbar: () => <div data-testid="mock-navbar">Navbar</div>
}));

vi.mock('../shared/LeftSideNav/LeftSideNav', () => ({
  default: () => <div data-testid="mock-left-nav">LeftSideNav</div>
}));

vi.mock('../shared/RightSideNav/RightSideNav', () => ({
  default: () => <div data-testid="mock-right-nav">RightSideNav</div>
}));

// Mock react-router-dom hooks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn()
  };
});

// Mock console methods
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('NewsPage Component', () => {
  const mockNews = {
    title: 'Test News Title',
    description: 'Test Description',
    content: 'Test Content',
    urlToImage: 'test-image.jpg',
    url: 'https://test-url.com',
    sentiment: 'positive'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useLocation.mockReturnValue({ state: { news: mockNews } });
    useNavigate.mockReturnValue(vi.fn());
  });

  const renderNewsPage = () => {
    return render(
      <BrowserRouter>
        <NewsPage />
      </BrowserRouter>
    );
  };

  // Sanity Tests
  describe('Sanity Checks', () => {
    it('renders without crashing', () => {
      expect(() => renderNewsPage()).not.toThrow();
    });

    it('displays news article content', () => {
      renderNewsPage();
      expect(screen.getByTestId('news-article')).toBeInTheDocument();
      expect(screen.getByTestId('news-title')).toHaveTextContent(mockNews.title);
      expect(screen.getByTestId('news-description')).toHaveTextContent(mockNews.description);
      expect(screen.getByTestId('news-content')).toHaveTextContent(mockNews.content);
    });

    it('displays news image when available', () => {
      renderNewsPage();
      const image = screen.getByTestId('news-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockNews.urlToImage);
    });
  });

  // Functional Tests
  describe('Sentiment Display', () => {
    it('displays positive sentiment with correct styling', () => {
      renderNewsPage();
      const badge = screen.getByTestId('sentiment-badge');
      expect(badge).toHaveTextContent('positive');
      expect(badge.className).toContain('bg-green-500');
    });

    it('displays negative sentiment with correct styling', () => {
      useLocation.mockReturnValue({
        state: {
          news: { ...mockNews, sentiment: 'negative' }
        }
      });
      renderNewsPage();
      const badge = screen.getByTestId('sentiment-badge');
      expect(badge).toHaveTextContent('negative');
      expect(badge.className).toContain('bg-red-500');
    });

    it('displays neutral sentiment with correct styling', () => {
      useLocation.mockReturnValue({
        state: {
          news: { ...mockNews, sentiment: 'neutral' }
        }
      });
      renderNewsPage();
      const badge = screen.getByTestId('sentiment-badge');
      expect(badge).toHaveTextContent('neutral');
      expect(badge.className).toContain('bg-gray-500');
    });
  });

  // Integration Tests
  describe('Article Reading', () => {
    it('marks article as read when clicking read more', async () => {
      markArticleAsRead.mockResolvedValueOnce({ success: true });
      
      renderNewsPage();
      const readMoreLink = screen.getByTestId('read-more-link');
      
      fireEvent.click(readMoreLink);

      await waitFor(() => {
        expect(markArticleAsRead).toHaveBeenCalledWith(mockNews.sentiment);
        expect(mockConsoleLog).toHaveBeenCalledWith('API Response:', { success: true });
      });
    });

    it('shows loading spinner while marking as read', async () => {
      markArticleAsRead.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderNewsPage();
      const readMoreLink = screen.getByTestId('read-more-link');
      
      fireEvent.click(readMoreLink);
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      });
    });

    it('handles error when marking article as read fails', async () => {
      const mockError = new Error('API Error');
      markArticleAsRead.mockRejectedValueOnce(mockError);
      
      const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      renderNewsPage();
      const readMoreLink = screen.getByTestId('read-more-link');
      
      fireEvent.click(readMoreLink);

      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Error in handleNews:', mockError);
        expect(mockAlert).toHaveBeenCalledWith('Failed to mark article as read.');
      });

      mockAlert.mockRestore();
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles missing news data gracefully', () => {
      useLocation.mockReturnValue({ state: null });
      expect(() => renderNewsPage()).toThrow();
    });

    it('handles missing sentiment data', async () => {
      useLocation.mockReturnValue({
        state: {
          news: { ...mockNews, sentiment: undefined }
        }
      });
      
      renderNewsPage();
      const readMoreLink = screen.getByTestId('read-more-link');
      
      fireEvent.click(readMoreLink);
      
      expect(markArticleAsRead).not.toHaveBeenCalled();
    });

    it('handles missing image URL', () => {
      useLocation.mockReturnValue({
        state: {
          news: { ...mockNews, urlToImage: undefined }
        }
      });
      
      renderNewsPage();
      expect(screen.queryByTestId('news-image')).not.toBeInTheDocument();
    });
  });
});
