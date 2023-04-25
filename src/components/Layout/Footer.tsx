import { Grid } from '@mui/material';
import styled from 'styled-components';
import Link from 'next/link';

function Footer() {
  return (
    <SCFooterContainer id="footer">
      <Grid container>
        <Grid item xs={12}>
          <div>
            <SCFooterContent className="d-flex justify-content-between gap-3">
              <Link href="/terms-and-conditions" target="blank" rel="noreferrer" className="item">
                TERMS & CONDITIONS
              </Link>
              <Link href="https://www.singtel.com/copyright" target="_blank" rel="noreferrer" className="item">
                COPYRIGHT
              </Link>
              <div className="item">
                <span>© Singtel (CRN: 199201624D) All Rights Reserved.</span>
              </div>
            </SCFooterContent>
          </div>
        </Grid>
      </Grid>
    </SCFooterContainer>
  );
}

const SCFooterContainer = styled.footer`
  border-top: 1px solid rgb(208, 208, 208);
  background-color: #f7f7f7;
`;

const SCFooterContent = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;

  & > a {
    text-decoration: none;
    font-weight: 350;
    font-size: 14px;
    line-height: 28px;
    text-transform: uppercase;
    color: #979797;
  }

  & > div {
    display: flex;
    align-items: center;
    justify-content: end;
    flex: 1;
    text-align: right;
  }

  span {
    color: #979797;
    font-weight: 350;
    font-size: 14px;
    line-height: 28px;
  }

  .logo {
    width: 55px;
    margin-right: 24px;
    display: none;
  }
`;

export default Footer;
