import { setupAxios } from '@/config/axios-config';
import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { setupReactQuery } from '@/config/react-query-config';
import { setupClientMocks, setupServerMocks } from '@/__mocks__/setup';
import { isTrue } from '@/helpers/utils';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import AppLayout from '@/components/AppLayout';
import { useEffect, useState } from 'react';

const mockServiceEnabled = isTrue(process.env.NEXT_PUBLIC_ENABLE_MOCK_SERVICE);
let mockServiceStarted = false;

if (mockServiceEnabled) {
  setupServerMocks();
}

//Axios default settings and interceptors
// TODO to differentiate client and server
setupAxios();

export default function App({ Component, pageProps }: AppProps) {
  const [shouldRender, setShouldRender] = useState(!mockServiceEnabled);
  const [queryClient] = useState(setupReactQuery);

  useEffect(() => {
    if (mockServiceEnabled && !mockServiceStarted) {
      mockServiceStarted = true;
      setupClientMocks().then(_ => {
        setShouldRender(true);
      });
    }
  }, []);

  // make sure the mock service load after the component mounted for fixing issue on refresh
  if (!shouldRender) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <AppLayout
          isAnonymous={pageProps.isAnonymous}
          hideHeaderNavbar={pageProps.hideHeaderNavbar}
          hideFooter={pageProps.hideHeaderNavbar}
        >
          <Component {...pageProps} />
        </AppLayout>
      </Hydrate>
      {isTrue(process.env.NEXT_PUBLIC_ENABLE_REACT_QUERY_DEVTOOLS) && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
