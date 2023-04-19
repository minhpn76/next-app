import { Loading, MessageBoundaryProvider } from '@geit/ui-components';
import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';
import { loginRedirect } from '@/helpers/utils';
import { useUdfToken } from '@/modules/common/services';

interface AuthenticationTemplateProps {
  isAnonymous: boolean;
}

export const AuthenticationTemplate = ({ isAnonymous, children }: PropsWithChildren<AuthenticationTemplateProps>) => {
  if (isAnonymous) {
    return <UnauthenticatedTemplate>{children}</UnauthenticatedTemplate>;
  } else {
    return <AuthenticatedTemplate>{children}</AuthenticatedTemplate>;
  }
};

const AuthenticatedTemplate = ({ children }: { children: React.ReactNode }) => {
  const { data, isFetching } = useUdfToken();
  const router = useRouter();

  if (isFetching) {
    return (
      <div className="h-100">
        <Loading />
      </div>
    );
  } else {
    if (!data) {
      loginRedirect(router);
      return <></>;
    }
  }

  return <MessageBoundaryProvider>{children}</MessageBoundaryProvider>;
};

const UnauthenticatedTemplate = ({ children }: { children: React.ReactNode }) => {
  return <MessageBoundaryProvider>{children}</MessageBoundaryProvider>;
};
