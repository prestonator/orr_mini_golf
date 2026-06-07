import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signInWithPin, signUpWithPin } from '../src/app/auth/actions';

// Mock the dependencies
const mockRpc = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockInsert = vi.fn();

const mockSupabase = {
  from: vi.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
  })),
  rpc: mockRpc,
};

vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabase),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

const mockSet = vi.fn();
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    set: mockSet,
    delete: vi.fn(),
  })),
}));

vi.mock('@/utils/auth', () => ({
  createSessionToken: vi.fn(() => 'mock-token'),
}));

describe('actions.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signInWithPin', () => {
    it('calls create_visit_for_user on successful sign in', async () => {
      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockResolvedValue({
        data: [{ id: 'user-123', pin: '1234' }],
        error: null,
      });

      const formData = new FormData();
      formData.append('identity', 'Alice');
      formData.append('pin', '1234');

      await signInWithPin(formData);

      expect(mockRpc).toHaveBeenCalledWith('create_visit_for_user', { target_user_id: 'user-123' });
    });
  });

  describe('signUpWithPin', () => {
    it('calls create_visit_for_user on successful sign up', async () => {
      mockSelect.mockReturnValue({ eq: mockEq });
      // First eq for checking if user exists
      mockEq.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      // Insert returns a select
      mockInsert.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: 'user-456' }],
          error: null,
        }),
      });

      const formData = new FormData();
      formData.append('identity', 'Bob');
      formData.append('pin', '5678');

      await signUpWithPin(formData);

      expect(mockRpc).toHaveBeenCalledWith('create_visit_for_user', { target_user_id: 'user-456' });
    });
  });
});
