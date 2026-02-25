// src/API/useProducts.test.tsx
import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useProductList } from "./useProducts";

// Mock Supabase
vi.mock("../components/utils/supabaseClient", () => {
  const chain: any = {};

  chain.select = vi.fn().mockImplementation(() => chain);
  chain.range = vi.fn().mockImplementation(() => chain);
  chain.order = vi.fn().mockImplementation(() => chain);
  chain.eq = vi.fn().mockImplementation(() => chain);
  chain.or = vi.fn().mockImplementation(() => chain);

  chain.then = vi.fn().mockImplementation((resolve) =>
    resolve({
      data: [
        { id: 1, name: "Product 1", active_status: true },
        { id: 2, name: "Product 2", active_status: false },
      ],
      error: null,
      count: 2,
    }),
  );

  const fromMock = vi.fn().mockImplementation(() => chain);

  return {
    supabaseClient: { from: fromMock },
    __mocks__: chain,
    fromMock,
  };
});

describe("useProductList hook", () => {
  let mocks: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = (await import("../components/utils/supabaseClient")) as any;
    mocks = mod.__mocks__;
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useProductList());

    expect(result.current.productList).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.itemsPerPage).toBe(10);
  });

  it("should fetch products successfully", async () => {
    const { result } = renderHook(() => useProductList());

    await act(async () => {
      await result.current.fetchProducts();
    });

    expect(result.current.productList).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.currentPage).toBe(1);
  });

  it("should handle Supabase error", async () => {
    mocks.then.mockImplementationOnce((resolve: (value: any) => void) =>
      resolve({
        data: null,
        error: { message: "Something went wrong" },
        count: null,
      }),
    );
    const { result } = renderHook(() => useProductList());

    await act(async () => {
      await result.current.fetchProducts();
    });

    expect(result.current.productList).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it("should handle pagination correctly", async () => {
    const { result } = renderHook(() => useProductList());

    await act(async () => {
      await result.current.fetchProducts(2);
    });

    // The key check: Supabase receives correct indices
    expect(mocks.range).toHaveBeenCalledWith(10, 19);
  });

  it("should apply activeStatus filter", async () => {
    const { result } = renderHook(() => useProductList());

    await act(async () => {
      await result.current.fetchProducts(1, true);
    });

    expect(mocks.eq).toHaveBeenCalledWith("active_status", true);
  });

  it("should apply searchQuery filter", async () => {
    const { result } = renderHook(() => useProductList());

    await act(async () => {
      await result.current.fetchProducts(1, undefined, "test");
    });

    expect(mocks.or).toHaveBeenCalledWith(
      "name.ilike.%test%,long_description.ilike.%test%",
    );
  });
});
