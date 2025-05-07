import styled from '@emotion/styled';

import logo from 'Assets/img/logo.png';
import { color } from 'Assets/style';
import { Page } from 'Components/Layout/Page';
import { Spacer } from 'Components/Layout/Spacer';

// Components

export const LoadingPage = () => {
  return (
    <Page caption="pwdr">
      <PageContentContainer>
        <Spacer size={35} />
        <Logo src={logo} alt="pwdr-logo" />
        <Name>pwdr</Name>
      </PageContentContainer>
    </Page>
  );
};

// Styled

const PageContentContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
`;

const Logo = styled.img`
    height: 175px
`;

const Name = styled.h1`
    margin: 0;
    font-size: 50px;
    font-weight: 400;
    color: ${color.logoDark};
`;