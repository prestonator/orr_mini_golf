import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthForm } from '../src/components/AuthForm';
import { describe, it, expect, vi } from 'vitest';

// Mock the actions
vi.mock('@/app/auth/actions', () => ({
  signInWithPin: vi.fn(),
  signUpWithPin: vi.fn(),
}));

describe('AuthForm', () => {
  const mockPlayers = [
    { id: '1', username: 'Alice' },
    { id: '2', username: 'Bob' },
  ];

  it('shows a scrollable grid of player tiles in "signin" mode', () => {
    render(<AuthForm players={mockPlayers} />);
    
    // In signin mode, it should show the players
    const aliceBtn = screen.getByText('Alice');
    const bobBtn = screen.getByText('Bob');
    
    expect(aliceBtn).toBeInTheDocument();
    expect(bobBtn).toBeInTheDocument();
    
    // The container should have the grid classes (we can check the parent element)
    const gridContainer = aliceBtn.closest('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('overflow-y-auto');
  });

  it('shows text input in "signup" mode', () => {
    render(<AuthForm players={mockPlayers} />);
    
    // Switch to signup mode
    const signUpTab = screen.getByText('Sign Up', { selector: 'button' });
    fireEvent.click(signUpTab);
    
    // Should show text input
    const input = screen.getByPlaceholderText('e.g. John Doe or john@example.com');
    expect(input).toBeInTheDocument();
    
    // Should NOT show the player tiles
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('clicking a tile advances to the PIN entry step', () => {
    render(<AuthForm players={mockPlayers} />);
    
    // Click Alice
    const aliceBtn = screen.getByText('Alice');
    // We actually need to click the button, Alice is inside a div, so find the button
    const btn = aliceBtn.closest('button');
    fireEvent.click(btn!);
    
    // Step 2: PIN entry
    expect(screen.getByText('Enter your 4-digit PIN')).toBeInTheDocument();
    
    // The back button should be visible
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
