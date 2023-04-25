import { Grid } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { BASE_PATH } from '@/helpers/constants';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();

  return (
    <SCHeader>
      <SCGrid>
        <Grid container>
          <Grid item xs={12}>
            <Link
              href={BASE_PATH + '/'}
              onClick={event => {
                event.preventDefault();
                router.push('/');
              }}
            >
              <Image src={`${BASE_PATH}/logo.svg`} alt="logo" width={69} height={47} priority />
            </Link>
          </Grid>
        </Grid>
      </SCGrid>
    </SCHeader>
  );
}

const SCHeader = styled.header`
  display: flex;
  align-items: center;
  background-color: rgb(29, 52, 68);
  border-top: 4px solid rgb(237, 26, 61);
`;

const SCGrid = styled(Grid)`
  height: 69px;
  padding-top: 4px;
`;
