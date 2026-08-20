"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryResult,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { ApiError } from "./apiInterfaces";

/**
 * Wrappers over TanStack Query that default the error type to `ApiError`,
 * so feature hooks don't repeat the generics. Always use these instead of
 * calling `useQuery` / `useMutation` directly.
 */
export function useApiQuery<TQueryFnData, TData = TQueryFnData>(
  options: UseQueryOptions<TQueryFnData, ApiError, TData, readonly unknown[]>,
): UseQueryResult<TData, ApiError> {
  return useQuery(options);
}

export function useApiMutation<TData, TVariables, TContext = unknown>(
  options: UseMutationOptions<TData, ApiError, TVariables, TContext>,
): UseMutationResult<TData, ApiError, TVariables, TContext> {
  return useMutation(options);
}

/**
 * Paged variant, for the "load more" grids in law / case / template search.
 * Pages are accumulated by React Query itself, so features never keep a
 * hand-rolled list of already-loaded rows in component state.
 */
export function useApiInfiniteQuery<TQueryFnData, TPageParam>(
  options: UseInfiniteQueryOptions<
    TQueryFnData,
    ApiError,
    InfiniteData<TQueryFnData, TPageParam>,
    readonly unknown[],
    TPageParam
  >,
): UseInfiniteQueryResult<InfiniteData<TQueryFnData, TPageParam>, ApiError> {
  return useInfiniteQuery(options);
}
