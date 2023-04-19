import { setupServerMocks } from '@/__mocks__/setup';
import { setupAxios } from '@/config/axios-config';
import { isTrue } from '@/helpers/utils';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

const mockServiceEnabled = isTrue(process.env.NEXT_PUBLIC_ENABLE_MOCK_SERVICE);
let mockServiceStarted = false;

if (mockServiceEnabled) {
  setupServerMocks();
}

//Axios default settings and interceptors
// TODO to differentiate client and server
setupAxios();

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
