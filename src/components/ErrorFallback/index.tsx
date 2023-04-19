import { Text } from '@dls/web';
import Image from 'next/image';
import { BASE_PATH } from '@/helpers/constants';

export function ErrorFallback() {
  return (
    <div className="d-flex justify-content-center align-items-center text-center my-5">
      <div>
        <div style={{ width: '50vw', height: '50vh', position: 'relative' }}>
          <Image alt="Mountains" src={BASE_PATH + '/fallback.png'} layout="fill" objectFit="contain" />
        </div>
        <Text type="boldBody">Oops! Something went wrong.</Text>
        <Text type="body">Please close the page and try again later.</Text>
      </div>
    </div>
  );
}
