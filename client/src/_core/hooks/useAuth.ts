import { APP_LOGO, getLoginUrl } from "@/lib/constants";
import { trpc } from "@/lib/trpc";
import type { UseAuthOptions } from "@/lib/types";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      throw error;
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(meQuery.data)
    );
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  // OAuth disabled - no redirect needed
  // useEffect(() => {
  //   if (meQuery.isLoading || logoutMutation.isPending) return;
  //   if (typeof window === "undefined") return;
  //   
  //   // If query succeeded but returned null, user is not whitelisted
  //   if (!meQuery.isLoading && meQuery.isSuccess && meQuery.data === null) {
  //     // Don't redirect if already on access-denied page
  //     if (window.location.pathname !== "/access-denied") {
  //       window.location.href = "/access-denied";
  //     }
  //   }
  // }, [meQuery.isLoading, meQuery.isSuccess, meQuery.data, logoutMutation.isPending]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
