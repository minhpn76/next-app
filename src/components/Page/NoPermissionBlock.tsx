import { ErrorBlock } from '@geit/ui-components';

export const NoPermissionBlock = () => {
  const gotoHome = () => (window.location.href = '/');

  return (
    <ErrorBlock
      title="Oops! You don’t have permission."
      description="Looks like you do not have permission to view or access this page due to permission policies set by your admin manager. Please contact your admin manager to gain access to this page."
      buttonOption={{ onClick: gotoHome }}
    />
  );
};
