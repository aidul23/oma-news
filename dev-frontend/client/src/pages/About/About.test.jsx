import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { About } from './About';

// Mock the components used in About
vi.mock('../shared/Header/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('../shared/Navbar/Navbar', () => ({
  Navbar: () => <div data-testid="mock-navbar">Navbar</div>
}));

vi.mock('../Home/BreakingNews', () => ({
  default: () => <div data-testid="mock-breaking-news">Breaking News</div>
}));

describe('About Component', () => {
  const renderAbout = () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    renderAbout();
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-breaking-news')).toBeInTheDocument();
  });

  it('displays the about section title', () => {
    renderAbout();
    expect(screen.getByText('About OmaNews')).toBeInTheDocument();
  });

  it('displays team member information', () => {
    renderAbout();
    
    // Aidul's information
    expect(screen.getByText('Md Aidul Islam')).toBeInTheDocument();
    expect(screen.getByText(/Md Aidul specializes in crafting/)).toBeInTheDocument();
    
    // Sadidur's information
    expect(screen.getByText('Sadidur Rahman Shaikat')).toBeInTheDocument();
    expect(screen.getByText(/Sadidur contributes to the frontend/)).toBeInTheDocument();
    
    // Anis's information
    expect(screen.getByText('Anis Mahmud')).toBeInTheDocument();
    expect(screen.getByText(/Anis is a backend engineer/)).toBeInTheDocument();
    
    // Ivan's information
    expect(screen.getByText('Ivan Perov')).toBeInTheDocument();
    expect(screen.getByText(/Ivan manages the server infrastructure/)).toBeInTheDocument();

    // Check all team members have the correct roles
    const roles = screen.getAllByText(/Engineer/);
    expect(roles).toHaveLength(4);
    expect(screen.getAllByText('Frontend Engineer')).toHaveLength(2);
    expect(screen.getAllByText('Backend Engineer')).toHaveLength(2);
  });

  it('displays the mission statement', () => {
    renderAbout();
    expect(screen.getByText(/OmaNews is a cutting-edge news platform/)).toBeInTheDocument();
  });

  it('displays team section title', () => {
    renderAbout();
    expect(screen.getByText('Our Team')).toBeInTheDocument();
  });

  it('renders team member images', () => {
    renderAbout();
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute('alt', 'aidul');
  });
});
