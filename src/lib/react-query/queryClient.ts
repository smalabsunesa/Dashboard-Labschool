import { QueryClient } from '@tanstack/react-query';

const THIRTY_DAYS_IN_MS = 2_592_000 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: THIRTY_DAYS_IN_MS,
      gcTime: THIRTY_DAYS_IN_MS,
      cacheTime: THIRTY_DAYS_IN_MS,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
