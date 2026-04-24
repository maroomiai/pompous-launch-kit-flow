/**
 * Centralized data hooks for Product entity.
 * Replaces scattered useEffect + setState + manual refresh patterns.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

/* ── query keys ─────────────────────────────────────────── */
export const productKeys = {
  all: ["products"],
  list: () => [...productKeys.all, "list"],
  detail: (id) => [...productKeys.all, "detail", id],
};

/* ── hooks ───────────────────────────────────────────────── */

/** List all products for the current user, newest first. */
export function useProducts() {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: () => base44.entities.Product.list("-created_date", 50),
    staleTime: 60 * 1000,
  });
}

/** Fetch a single product by id. */
export function useProduct(id) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const results = await base44.entities.Product.filter({ id });
      if (!results.length) throw new Error("Product not found");
      return results[0];
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/** Update a product and invalidate relevant caches. */
export function useUpdateProduct(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => base44.entities.Product.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
    onError: (err) => {
      console.error("Failed to update product:", err);
      toast.error("Failed to save. Please try again.");
    },
  });
}