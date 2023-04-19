import { TextLink } from '@dls/web';
import { useRouter } from 'next/router';
import React from 'react';
import { TextLinkProps } from '@/@types/dls/web/components/TextLink';
import { BASE_PATH } from '@/helpers/constants';

interface CLinkProps extends Omit<TextLinkProps, 'href'> {
  href: string | null;
  replace?: boolean;
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  children: string | number;
}

const CLink = (props: CLinkProps) => {
  const router = useRouter();
  const { href, replace, onClick, icon, iconOnRight, children, ...rest } = props;
  const fullHref = href ? `${BASE_PATH}${href}` : undefined;

  return (
    <TextLink
      href={fullHref}
      onClick={event => {
        onClick?.(event);
        href && (replace ? router.replace(href) : router.push(href));
        event.preventDefault();
      }}
      {...rest}
    >
      {icon && !iconOnRight && <TextLink.Icon icon={props.icon} />}
      <TextLink.Text>{children}</TextLink.Text>
      {icon && iconOnRight && <TextLink.Icon icon={props.icon} />}
    </TextLink>
  );
};

export default CLink;
