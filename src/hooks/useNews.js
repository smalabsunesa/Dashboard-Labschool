import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '../lib/api';

export default function useNews() {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['news'],
    queryFn: ({ signal }) => fetchNews(signal),
  });

  const errorMessage = error instanceof Error ? error.message : (error ? 'Unable to load updates right now.' : null);

  return {
    data: data ?? [],
    loading: isLoading,
    error: errorMessage,
  };
}
