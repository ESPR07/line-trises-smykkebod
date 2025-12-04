import React from "react";
import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useProductList } from "./useProducts";
import type { Database } from "../@types/Database";

const mockProducts: Database["public"]["Tables"]["products"]["Row"][] = [
  {
    id: "1",
    name: "Product A",
    price: 1,
    discount: true,
    discount_amount: 1,
    short_description: "short",
    long_description: "long",
    image_url: "url",
    active_status: true,
  },
  {
    id: "2",
    name: "Product B",
    price: 2,
    discount: false,
    discount_amount: 0,
    short_description: "short",
    long_description: "long",
    image_url: "url",
    active_status: true,
  },
];

vi.mock("../components/utils/supabaseClient", () => {
  return {
    supabaseClient: {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: mockProducts, error: null }),
      }),
    },
  };
});

describe("useProductList hook", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("fetches product list successfully", async () => {
    let hookResult: ReturnType<typeof useProductList> | undefined;

    const TestComponent: React.FC = () => {
      hookResult = useProductList();
      return null;
    };

    render(<TestComponent />);

    await waitFor(() => expect(hookResult!.isLoading).toBe(false));

    expect(hookResult!.isError).toBe(false);
    expect(hookResult!.productList).toEqual(mockProducts);
  });

  it("sets error when fetch fails", async () => {
    const { supabaseClient } = await import(
      "../components/utils/supabaseClient"
    );
    (supabaseClient.from as unknown as ReturnType<typeof vi.fn>)
      .mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: null, error: { message: "Failed" } }),
      });

    let hookResult: ReturnType<typeof useProductList> | undefined;

    const TestComponent: React.FC = () => {
      hookResult = useProductList();
      return null;
    };

    render(<TestComponent />);

    await waitFor(() => expect(hookResult!.isLoading).toBe(false));

    expect(hookResult!.isError).toBe(true);
    expect(hookResult!.productList).toBeUndefined();
  });
});
