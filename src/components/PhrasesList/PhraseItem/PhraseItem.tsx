import { ReactElement, useCallback, useMemo } from 'react';

import styled from '@emotion/styled';

import { color } from 'Assets/style';
import { Spacer } from 'Components/Layout/Spacer';
import { PhraseListLabel } from 'Components/PhrasesList/PhraseItem/PhraseItemLabel';
import { PhraseItemPwdr } from 'Components/PhrasesList/PhraseItem/PhraseItemPwdr';
import { Phrase } from 'Hooks/usePhrases';

// Types

export interface PhraseItemProps {
  phrase: Phrase;
  onSelected: (phrase: Phrase) => void;
  onUnselected: () => void;
  selected?: boolean;
}

type T = (props: PhraseItemProps) => ReactElement

// Components

export const PhraseItem: T = ({ phrase, onSelected, onUnselected, selected }) => {

  const classNames = useMemo(() => {
    const classNames = [];
    if (selected) classNames.push('selected');
    return classNames.join(' ');
  }, [selected]);

  const onClick = useCallback(() => {
    if (!selected) onSelected(phrase);
    else onUnselected();
  }, [selected, phrase, onSelected, onUnselected]);


  return (
    <PhraseItemStyled onClick={onClick} className={classNames}>
      <PhraseListLabel phrase={phrase} />
      {selected && (
        <>
          <Spacer size={5} />
          <PhraseItemPwdr phrase={phrase} />
        </>
      )}
    </PhraseItemStyled>
  );
};

// Styled

const PhraseItemStyled = styled.div`
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 6px;
    box-shadow: 0 1px 2px 0 ${color.shadowDark};
    margin-bottom: 8px;
    background-color: #fff;

    &.selected {
        box-shadow: 0 2px 5px 1px ${color.shadowDark};
    }

    :hover:not(.selected) {
        box-shadow: 0 2px 5px 0 ${color.shadowDark};
    }
`;