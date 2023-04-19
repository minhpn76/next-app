import { Button } from '@dls/web';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { ButtonProps } from '@/@types/dls/web/components/Button';

interface BackButtonProp extends ButtonProps {
  disabled?: boolean;
  fallbackUrl?: string;
  children?: ReactNode;
}
/**
 * problems with `router.back()`:
 * 1. next-router's `router.back()` function takes to the previous page which can be backward or forward.
 * 2. When the user direct enter URL and if the user hit the back button `router.back()` will redirect to a blank page.
 * BackButton solutions:
 * 1. BackButton always takes to backward page just like `window.history.back()` if there is any.
 * 2. If there is no history of the backward page it uses `fallbackUrl` to redirect.
 * BackButton takes help from the `RouteHistoryWorker` component and uses `window.history.state?._from`
 * @params
 * @disabled: If button need to disabled
 * @fallbackUrl: route to URL if there is no route history
 * @text: Button Text
 * @returns ReactElement;
 */
const BackButton = ({ children = 'Back', disabled, fallbackUrl, fullWidth }: BackButtonProp) => {
  const router = useRouter();
  const onClick = () => {
    if (!fallbackUrl || window.history.state?._from === fallbackUrl) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };
  return (
    <Button secondary disabled={disabled} onClick={onClick} fullWidth={fullWidth}>
      {children}
    </Button>
  );
};

export default BackButton;
