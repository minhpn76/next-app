import { Column, Grid, Row } from '@dls/web';
import styled from 'styled-components';
import { media } from '@/config/theme-config';

function Footer() {
  return (
    <SCFooterContainer id="footer">
      <Grid fluid={false}>
        <Row>
          <Column>
            <SCFooterContent className="d-flex justify-content-between gap-3">
              <a href="/terms-and-conditions" target="blank" rel="noreferrer" className="item">
                TERMS & CONDITIONS
              </a>
              <a href="https://www.singtel.com/copyright" target="_blank" rel="noreferrer" className="item">
                COPYRIGHT
              </a>
              <div className="item">
                <span>© Singtel (CRN: 199201624D) All Rights Reserved.</span>
              </div>
            </SCFooterContent>
          </Column>
        </Row>
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

  ${media.md`
    flex-direction: row;

    .logo {
      display: block;
    }

    & > a {
      margin-right: 24px;
      font-size: 16px;
    }

    span {
      font-size: 16px;
    }
  `}
`;

export default Footer;
