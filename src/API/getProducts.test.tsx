import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FetchResult } from '../types/Database';

// --- Mock product data ---
const mockProducts: FetchResult[] = [
  { id: 1, name: 'Product A', price: 1, created_at: "A", discount: true, discount_amount: 1, image_url: "url", short_description: "short", long_description: "long" },
  { id: 2, name: 'Product B', price: 2, created_at: "B", discount: false, discount_amount: 2, image_url: "url", short_description: "short", long_description: "long" },
];

describe('getProductList hook', () => {
  beforeEach(() => {
    vi.resetModules(); // important: clears cached modules so new mocks apply
  });

  it('fetches product list successfully', async () => {
    vi.doMock('@supabase/supabase-js', () => {
      return {
        createClient: () => ({
          from: () => ({
            select: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
          }),
        }),
      };
    });

    const { getProductList } = await import('./getProducts');

    let hookResult: ReturnType<typeof getProductList> | undefined;

    const TestComponent: React.FC = () => {
      hookResult = getProductList();
      return null;
    };

    render(<TestComponent />);

    await waitFor(() => expect(hookResult!.isLoading).toBe(false));

    expect(hookResult!.isError).toBe(false);
    expect(hookResult!.productList).toEqual(mockProducts);
  });

  it('sets error when fetch fails', async () => {
    vi.doMock('@supabase/supabase-js', () => {
      return {
        createClient: () => ({
          from: () => ({
            select: vi.fn().mockResolvedValue({ data: null, error: 'Failed' }),
          }),
        }),
      };
    });

    const { getProductList } = await import('./getProducts');

    let hookResult: ReturnType<typeof getProductList> | undefined;

    const TestComponent: React.FC = () => {
      hookResult = getProductList();
      return null;
    };

    render(<TestComponent />);

    await waitFor(() => expect(hookResult!.isLoading).toBe(false));

    expect(hookResult!.isError).toBe(true);
    expect(hookResult!.productList).toBeUndefined();
  });
});