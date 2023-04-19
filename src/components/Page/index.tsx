import { BasePage, BasePageProps } from '@geit/ui-components';
import { PropsWithChildren } from 'react';
import { NoPermissionBlock } from './NoPermissionBlock';

interface PageProps {
  /** breadcrumb list to display on top of the page */
  // breadcrumbs?: BreadcrumbItem[];
}

/** Base component for each page */
const Page = ({
  children,
  // breadcrumbs,
  fluid = false,
  ...basePageProps
}: PropsWithChildren<PageProps & Omit<BasePageProps, 'appType' | 'breadcrumbs' | 'noPermissionComponent'>>) => {
  return (
    <>
      <BasePage
        fluid={fluid}
        {...basePageProps}
        appType="empower"
        // TODO breadcrumbs={breadcrumbs?.map(item => ({ ...item, onClick: () => item.link && navigate(item.link) }))}
        noPermissionComponent={<NoPermissionBlock />}
      >
        {children}
      </BasePage>
    </>
  );
};

export default Page;
