import { QueryClient, QueryKey, SetDataOptions } from '@tanstack/react-query';

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      useErrorBoundary: (error: any) => {
        // Request is canceled if token expired (handled in axios-config request interceptor)
        // Don't throw this error to error boundary
        if (error?.message === 'canceled') return false;
        return true;
      },
      retry: 0,
    },
  },
});

export const setupReactQuery = () => {
  // console.log('setupReactQuery====================', typeof window === 'undefined');
  return queryClient;
};

export const optimisticAddConfig = (queryKey: QueryKey) => {
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    onMutate: async (target: any) => {
      // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(queryKey);

      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => (old ? [...old, target] : [target]));
      return { previous };
    },
    onError: (_error: any, _data: any, context: any) => queryClient.setQueryData(queryKey, context.previous),
  };
};

export const optimisticUpdateConfig = <T, R>(
  queryKey: QueryKey,
  cacheUpdater?: { updater: (_old: T, _nw: R) => T; options?: SetDataOptions },
  idKey: string = 'id'
) => {
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    onMutate: async (target: any) => {
      // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(queryKey);

      const previous = queryClient.getQueryData<T>(queryKey);

      if (cacheUpdater) {
        queryClient.setQueryData(
          queryKey,
          (old: any) => {
            return cacheUpdater.updater(old, target);
          },
          cacheUpdater.options
        );
      } else {
        queryClient.setQueryData(queryKey, (old?: any[]) => {
          return old?.map(item => (item[idKey] === target[idKey] ? { ...item, ...target } : item)) || [];
        });
      }

      return { previous };
    },
    onError: (_error: any, _data: any, context: any) => queryClient.setQueryData(queryKey, context.previous),
  };
};

export const optimisticDeleteConfig = (queryKey: QueryKey, idKey: string = 'id') => {
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    onMutate: async (target: any) => {
      // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(queryKey);

      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return old?.filter(item => item[idKey] !== target[idKey]) || [];
      });
      return { previous };
    },
    onError: (_error: any, _data: any, context: any) => queryClient.setQueryData(queryKey, context.previous),
  };
};
