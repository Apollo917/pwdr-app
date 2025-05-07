import { MouseEventHandler, ReactElement, useCallback } from 'react';

import { EditOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

import { color, nonSelectableContentStyle } from 'Assets/style';
import { IconButton } from 'Components/Controls/IconButton';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useOverflowComponent } from 'Hooks/useOverflowComponent';
import { Phrase } from 'Hooks/usePhrases';
import { EDIT_PHRASE_PAGE_NAME } from 'Pages/EditPhrasePage';

// Types

export interface PhraseItemLabelProps {
  phrase: Phrase;
}

type T = (props: PhraseItemLabelProps) => ReactElement;

// Components

export const PhraseListLabel: T = ({ phrase }) => {
  const { showComponent } = useOverflowComponent();
  const { handleError } = useErrorHandler();


  const editPhrase: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.stopPropagation();
    showComponent(EDIT_PHRASE_PAGE_NAME, phrase).catch(handleError);
  }, [phrase, showComponent, handleError]);


  return (
    <PhraseItemLabelStyled>
      <LabelContainer>
        <Label>{phrase.label}</Label>
        <Sign>{phrase.signature}</Sign>
      </LabelContainer>
      <IconButton onClick={editPhrase}>
        <EditOutlined />
      </IconButton>
    </PhraseItemLabelStyled>
  );
};

// Styled

const PhraseItemLabelStyled = styled.div`
    ${nonSelectableContentStyle};

    display: flex;
    justify-content: space-between;
`;

const Label = styled.h2`
    margin: 0 0 2px 0;
    font-size: 16px;
    font-weight: 500;
    color: ${color.textPrimaryDark};
`;

const Sign = styled.h3`
    margin: 0;
    font-size: 11px;
    font-weight: 500;
    color: ${color.textSecondaryDark};
`;

const LabelContainer = styled.div`
    width: 100%;
`;
