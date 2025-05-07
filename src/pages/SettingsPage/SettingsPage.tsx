import { useCallback, useMemo } from 'react';

import styled from '@emotion/styled';

import locale from 'Assets/locale';
import { CloseButton } from 'Components/Controls/CloseButton';
import { DestroyVaultMultiConfirm } from 'Components/Controls/DestroyVaultMultiConfirm';
import { OverflowComponent } from 'Components/Layout/OverflowComponent';
import { Page } from 'Components/Layout/Page';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useOverflowComponent } from 'Hooks/useOverflowComponent';

// Constants

export const SETTINGS_PAGE_NAME = 'settings-page';

// Components

export const SettingsPage = () => {
  const { hideComponent } = useOverflowComponent();
  const { handleError } = useErrorHandler();


  const close = useCallback(() => {
    hideComponent(SETTINGS_PAGE_NAME).catch(handleError);
  }, [hideComponent, handleError]);

  const headerControls = useMemo(() => {
    return (<CloseButton onClick={close} />);
  }, [close]);


  return (
    <OverflowComponent name={SETTINGS_PAGE_NAME}>
      <Page caption={locale.captionSettings} headerControls={headerControls}>
        <PageContentContainer>
          <DestroyVaultMultiConfirm displayStyle="button" />
        </PageContentContainer>
      </Page>
    </OverflowComponent>
  );
};

// Styled

const PageContentContainer = styled.div`
    padding: 10px 5px;
    height: 100%;
`;
