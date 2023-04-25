import Image from 'next/image';
import { BASE_PATH } from '@/helpers/constants';

export function ErrorFallback() {
  return (
    <div className="d-flex justify-content-center align-items-center text-center my-5">
      <div>
        <div style={{ width: '50vw', height: '50vh', position: 'relative' }}>
          <Image alt="Mountains" src={BASE_PATH + '/fallback.png'} layout="fill" objectFit="contain" />
        </div>
        <p>Oops! Something went wrong.</p>
        <p>Please close the page and try again later.</p>
      </div>
    </div>
  );
}
