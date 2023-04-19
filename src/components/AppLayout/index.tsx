import { ErrorBoundary } from '@geit/ui-components';
import { PropsWithChildren } from 'react';
import { AuthenticationTemplate } from './AuthenticationTemplate';
import { ErrorFallback } from '../ErrorFallback';
import { Footer, Header } from '../Layout';

interface LayoutProps {
  /**
   * Default false, set to true if accessibility of the page does not requre login
   */
  isAnonymous?: boolean;
  /**
   * Default false, it only works if isAnonymous=false, once set to true,
   */
  hideHeaderNavbar?: boolean;
  hideFooter?: boolean;
}

const AppLayout = ({
  isAnonymous = false,
  hideHeaderNavbar = false,
  hideFooter = false,
  children,
}: PropsWithChildren<LayoutProps>) => {
  return (
    <>
      {!hideHeaderNavbar && <Header />}
      <AuthenticationTemplate isAnonymous={isAnonymous}>
        <main>
          <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
        </main>
      </AuthenticationTemplate>
      {!hideFooter && <Footer />}
    </>
  );
};

export default AppLayout;
