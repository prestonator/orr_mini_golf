import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../src/app/page';
import React from 'react';

// Mock AuthForm
vi.mock('@/components/AuthForm', () => ({
  AuthForm: (props: any) => React.createElement('div', { 'data-testid': 'auth-form', 'data-players': JSON.stringify(props.players) })
}));

const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockSupabase = {
  from: vi.fn(() => ({
    select: mockSelect,
  })),
};

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabase),
}));

describe('LoginPage', () => {
  it('fetches existing players and passes them to AuthForm', async () => {
    mockSelect.mockReturnValue({ order: mockOrder });
    const mockPlayers = [{ id: '1', username: 'Alice' }, { id: '2', username: 'Bob' }];
    mockOrder.mockResolvedValue({
      data: mockPlayers,
      error: null,
    });

    const searchParams = Promise.resolve({});
    const component = await LoginPage({ searchParams });

    expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
    expect(mockSelect).toHaveBeenCalledWith('id, username');
    expect(mockOrder).toHaveBeenCalledWith('username', { ascending: true });
    
    // component is a React Element
    // children[0] and children[1] are decorative divs
    // children[2] is the wrapper div for AuthForm
    const wrapperDiv = component.props.children[2];
    const authForm = wrapperDiv.props.children;
    expect(authForm.props.players).toEqual(mockPlayers);
  });
});
