import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { useAuthStore } from '../../../store/useAuthStore';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component UI & Integration', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null });
    mockNavigate.mockClear();
  });

  it('renders login form correctly', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    expect(screen.getByText('تسجيل الدخول')).toBeInTheDocument();
    expect(screen.getByLabelText(/البريد الإلكتروني/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/كلمة المرور/i)).toBeInTheDocument();
  });

  it('shows error on invalid credentials via MSW', async () => {
    const user = userEvent.setup();
    render(<BrowserRouter><Login /></BrowserRouter>);

    await user.type(screen.getByLabelText(/البريد الإلكتروني/i), 'wrong@clinic.com');
    await user.type(screen.getByLabelText(/كلمة المرور/i), 'wrongpass');
    
    fireEvent.click(screen.getByRole('button', { name: /دخول/i }));

    await waitFor(() => {
      expect(screen.getByText('بيانات الدخول غير صحيحة')).toBeInTheDocument();
    });
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('logs in successfully and redirects to dashboard via MSW', async () => {
    const user = userEvent.setup();
    render(<BrowserRouter><Login /></BrowserRouter>);

    await user.type(screen.getByLabelText(/البريد الإلكتروني/i), 'admin@clinic.com');
    await user.type(screen.getByLabelText(/كلمة المرور/i), 'password');
    
    fireEvent.click(screen.getByRole('button', { name: /دخول/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('fake-jwt-token');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
