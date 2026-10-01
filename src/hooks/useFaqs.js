import { useQuery } from '@tanstack/react-query';
import { fetchFaqs } from '../lib/api';

export default function useFaqs() {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['faqs'],
    queryFn: ({ signal }) => fetchFaqs(signal),
  });

  const errorMessage = error instanceof Error ? error.message : (error ? 'Unable to load FAQs right now.' : null);

  return {
    data: data ?? [],
    loading: isLoading,
    error: errorMessage,
  };
}
