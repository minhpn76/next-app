import { TextField, Button, Card, Container, CardContent } from '@mui/material';
import { DataLoading, ErrorSlate } from '@/components';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
// import { CLink } from '@/components';
import { BASE_PATH } from '@/helpers/constants';
import { ROUTES } from '@/modules/login/constants';
import { useSignIn } from '@/modules/login/services';

const Login = () => {
  const { mutateAsync: signIn, isLoading, error } = useSignIn();
  const [brn, setBrn] = useState('');
  const [email, setEmail] = useState('');
  const [serviceNo, setServiceNo] = useState('');
  const router = useRouter();

  const doSignIn = useCallback(
    (event: any) => {
      event.preventDefault && event.preventDefault();
      signIn({ brn, email, serviceNo }).then(_ => router.push('/dashboard'));
    },
    [brn, email, router, serviceNo, signIn]
  );

  return (
    <DataLoading isLoading={isLoading} showAsOverlay>
      <LoginContainer className={'d-flex justify-content-center align-items-center'}>
        <Container maxWidth="md">
          <Image src={`${BASE_PATH}/logo-black.svg`} alt="logo" width={120} height={120} priority className="my-4" />
          <Card>
            <CardContent>
              <div className="px-lg-3">
                <Container>
                  <div className="mb-3 text-center">Log in to view special recon offers for your company</div>
                </Container>
                <div style={{ maxWidth: 400, margin: '0 auto' }}>
                  <Container>
                    <TextField
                      label="Company BRN"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setBrn(event.target.value)}
                    />
                  </Container>
                  <Container>
                    <TextField
                      label="Email address"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    />
                  </Container>
                  <Container>
                    <TextField
                      label="Service ID"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setServiceNo(event.target.value)}
                    />
                  </Container>
                  <Container className="px-md-5 pt-3">
                    <ErrorSlate error={error} />
                    <Button fullWidth onClick={doSignIn}>
                      Sign in
                    </Button>
                  </Container>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <Spacing top={'115px'} bottom={2}>
            <Text>© Singtel (CRN: 199201624D) All Rights Reserved.</Text>
            <CLink href={'/'}>Contact us</CLink>{' '}
            <Text tag="span" color="#222222">
              |
            </Text>{' '}
            <CLink href={'/'}>Data protection</CLink>{' '}
            <Text tag="span" color="#222222">
              |
            </Text>{' '}
            <CLink href={'/'}>Terms of use</CLink>
          </Spacing> */}
        </Container>
      </LoginContainer>
    </DataLoading>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      isAnonymous: true,
      hideHeaderNavbar: true,
      hideFooter: true,
    },
  };
};

export const LoginContainer = styled.div`
  background: url(${BASE_PATH}/login-bg.png);
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
`;

export default Login;
