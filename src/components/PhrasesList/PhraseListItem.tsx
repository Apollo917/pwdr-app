import { MouseEventHandler, ReactElement, useCallback, useMemo } from 'react';

import styled from '@emotion/styled';
import { Edit } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from "@mui/material";

import { useErrorHandler } from "Hooks/useHandleError";
import { useOverflowComponent } from "Hooks/useOverflowComponent";
import { Phrase } from 'Hooks/usePhrases';
import { EDIT_PHRASE_PAGE_NAME } from "Pages/EditPhrasePage";
import { color } from 'Utils/style';

// Types

export interface PhraseItemProps {
  phrase: Phrase;
  onClick: (phrase: Phrase) => void;
}

type T = (props: PhraseItemProps) => ReactElement

// Components

export const PhraseListItem: T = ({ phrase, onClick }) => {
  const { showComponent } = useOverflowComponent();
  const { handleError } = useErrorHandler();


  const handleClick = useCallback(() => {
    if (onClick) onClick(phrase);
  }, [phrase, onClick]);

  const editPhrase: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.stopPropagation();
    showComponent(EDIT_PHRASE_PAGE_NAME, phrase).catch(handleError);
  }, [phrase, showComponent, handleError]);

  const signature = useMemo(() => {
    const { signature } = phrase;
    return `${signature.substring(0, 14)}....${signature.substring(50, 64)}`;
  }, [phrase]);

  const signatureTooltipTitle = useMemo(() => {
    const { signature } = phrase;
    const headerStyle = { display: 'block', fontSize: '12px', marginBottom: '3px' };

    return (
        <>
          <b style={headerStyle}>Secret phrase signature</b>
          {signature.substring(0, 21)}<br/>
          {signature.substring(21, 42)}<br/>
          {signature.substring(42, 64)}<br/>
        </>
    );
  }, [phrase]);


  return (
      <PhraseItemStyled onClick={handleClick}>
        <div>
          <Typography fontSize={16} fontWeight={500}>
            {phrase.label}
          </Typography>
          <Tooltip
              arrow
              enterDelay={500}
              enterNextDelay={500}
              leaveDelay={200}
              title={signatureTooltipTitle}
              placement="top-start"
          >
            <Typography color="textSecondary" fontSize={11} fontWeight={500}>
              {signature}
            </Typography>
          </Tooltip>
        </div>
        <IconButton onClick={editPhrase} size="medium">
          <Edit fontSize="small"/>
        </IconButton>
      </PhraseItemStyled>
  );
};

// Styled

const PhraseItemStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 5px 10px;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0 1px 2px 0 ${color.shadowDark};
    margin-bottom: 8px;
    background-color: #fff;

    :hover {
        box-shadow: 0 2px 5px 0 ${color.shadowDark};
    }
`;
