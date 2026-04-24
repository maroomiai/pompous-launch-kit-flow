/**
 * Centralized hook for accessing the current authenticated user.
 * Replaces the repeated `base44.auth.me()` pattern scattered across pages.
 * Uses React Query so the result is cached and shared across components.
 */
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useUser() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
    retry: false,
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });

  return { user: user ?? null, isLoading, error };
}