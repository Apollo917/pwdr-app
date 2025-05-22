import { useCallback, useMemo } from 'react';

import styled from '@emotion/styled';
import { ControlPoint, LockOutlined, SettingsOutlined } from '@mui/icons-material';
import { IconButton } from "@mui/material";

import logo from "Assets/img/logo.png";
import { Page } from 'Components/Layout/Page';
import { Spacer } from 'Components/Layout/Spacer';
import { Logo } from "Components/LogoImg";
import { PhrasesList } from 'Components/PhrasesList';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useOverflowComponent } from 'Hooks/useOverflowComponent';
import { usePhrases } from "Hooks/usePhrases";
import { useVault } from 'Hooks/useVault';
import { ADD_PHRASE_PAGE_NAME } from 'Pages/AddPhrasePage';
import { SETTINGS_PAGE_NAME } from 'Pages/SettingsPage';

// Types

type ShowPage = (name: string) => void;

// Components

export const PhrasesPage = () => {
  const { phrases } = usePhrases();
  const { lockVault } = useVault();
  const { showComponent } = useOverflowComponent();
  const { handleError } = useErrorHandler();


  const showPage: ShowPage = useCallback((name) => {
    showComponent(name).catch(handleError);
  }, [showComponent, handleError]);

  const footer = useMemo(() => {
    return (
        <FooterContainer>
          <IconButton onClick={() => showPage(ADD_PHRASE_PAGE_NAME)} size="medium">
            <ControlPoint fontSize="inherit"/>
          </IconButton>
          <Spacer size={30}/>
          <IconButton onClick={lockVault} size="medium" color="error">
            <LockOutlined fontSize="large"/>
          </IconButton>
          <Spacer size={30}/>
          <IconButton onClick={() => showPage(SETTINGS_PAGE_NAME)} size="medium">
            <SettingsOutlined fontSize="inherit"/>
          </IconButton>
        </FooterContainer>
    );
  }, [showPage, lockVault]);


  return (
      <Page caption="pwdr" footerControls={footer}>
        {phrases.length ? <PhrasesList/> : <LogoContainer><Logo src={logo} alt="pwdr-logo"/></LogoContainer>}
      </Page>
  );
};

// Styled

const FooterContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #d5d2e0;
`;

const LogoContainer = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        height: 200px;
        opacity: .1;
    }
`;