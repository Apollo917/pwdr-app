import { useCallback, useMemo } from 'react';

import { LockFilled, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

import { color } from 'Assets/style';
import { IconButton } from 'Components/Controls/IconButton';
import { Page } from 'Components/Layout/Page';
import { Spacer } from 'Components/Layout/Spacer';
import { PhrasesList } from 'Components/PhrasesList';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useOverflowComponent } from 'Hooks/useOverflowComponent';
import { useVault } from 'Hooks/useVault';
import { CREATE_PHRASE_PAGE_NAME } from 'Pages/AddPhrasePage';
import { SETTINGS_PAGE_NAME } from 'Pages/SettingsPage';

// Types

type ShowPage = (name: string) => void;

// Components

export const PhrasesPage = () => {
  const { lockVault } = useVault();
  const { showComponent } = useOverflowComponent();
  const { handleError } = useErrorHandler();


  const showPage: ShowPage = useCallback((name) => {
    showComponent(name).catch(handleError);
  }, [showComponent, handleError]);

  const footer = useMemo(() => {
    return (
      <FooterContainer>
        <IconButton onClick={() => showPage(CREATE_PHRASE_PAGE_NAME)} componentSize="small">
          <PlusCircleOutlined />
        </IconButton>
        <Spacer size={40} />
        <IconButton onClick={lockVault} componentSize="large" hoverColor={color.dangerLight}
                    activeColor={color.danger}>
          <LockFilled />
        </IconButton>
        <Spacer size={40} />
        <IconButton onClick={() => showPage(SETTINGS_PAGE_NAME)} componentSize="small">
          <SettingOutlined />
        </IconButton>
      </FooterContainer>
    );
  }, [showPage, lockVault]);


  return (
    <Page caption="pwdr" footerControls={footer}>
      <PhrasesList />
    </Page>
  );
};

// Styled

const FooterContainer = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid ${color.borderSecondary};
`;
