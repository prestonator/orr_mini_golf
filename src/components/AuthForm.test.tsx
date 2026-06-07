import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { AuthForm } from './AuthForm';

// Mock the actions
vi.mock('@/app/auth/actions', () => ({
  signInWithPin: vi.fn().mockResolvedValue({}),
  signUpWithPin: vi.fn().mockResolvedValue({})
}));

test('AuthForm toggles between signin and signup modes', () => {
  const players = [
    { id: '1', username: 'PlayerOne' },
    { id: '2', username: 'PlayerTwo' }
  ];
  
  render(<AuthForm players={players} />);
  
  // Initially in signin mode, should see player tiles
  expect(screen.getByText('PlayerOne')).toBeDefined();
  expect(screen.getByText('PlayerTwo')).toBeDefined();
  
  // Switch to signup mode
  fireEvent.click(screen.getByText('Sign Up', { selector: 'button' }));
  
  // Should see text input
  expect(screen.getByPlaceholderText('e.g. John Doe or john@example.com')).toBeDefined();
  // Player tiles should be gone
  expect(screen.queryByText('PlayerOne')).toBeNull();
});

test('AuthForm clicking a tile advances to PIN entry', () => {
  const players = [
    { id: '1', username: 'PlayerOne' }
  ];
  
  render(<AuthForm players={players} />);
  
  // Click the player tile
  fireEvent.click(screen.getByText('PlayerOne'));
  
  // Should advance to PIN entry step (step 2)
  expect(screen.getByText('Enter your 4-digit PIN')).toBeDefined();
});

test('AuthForm allows PIN entry', () => {
  const players = [
    { id: '1', username: 'PlayerOne' }
  ];
  
  render(<AuthForm players={players} />);
  
  // Click the player tile
  fireEvent.click(screen.getByText('PlayerOne'));
  
  // Enter PIN "1234"
  fireEvent.click(screen.getByText('1'));
  fireEvent.click(screen.getByText('2'));
  fireEvent.click(screen.getByText('3'));
  fireEvent.click(screen.getByText('4'));
  
  // Submit button should be enabled
  const submitButton = screen.getByText('Sign In', { selector: 'button[type="submit"]' }) as HTMLButtonElement;
  expect(submitButton.disabled).toBe(false);
});
