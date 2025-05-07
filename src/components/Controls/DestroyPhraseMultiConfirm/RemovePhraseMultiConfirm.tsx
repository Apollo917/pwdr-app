import { ReactElement, useCallback } from 'react';

import styled from '@emotion/styled';

import locale from 'Assets/locale';
import { color, nonSelectableContentStyle } from 'Assets/style';
import { ParanoidConfirmButton } from 'Components/Controls/ParanoidConfirmButton';
import { useErrorHandler } from 'Hooks/useHandleError';
import { Phrase } from 'Hooks/usePhrases';
import { useVault } from 'Hooks/useVault';


// Types

export interface RemovePhraseMultiConfirmProps {
  phrase?: Phrase | null;
  onRemoved: () => void;
}

type T = (props: RemovePhraseMultiConfirmProps) => ReactElement

// Components

export const RemovePhraseMultiConfirm: T = ({ phrase, onRemoved }) => {
  const { removePhrase } = useVault();
  const { handleError } = useErrorHandler();

  const onConfirm = useCallback(() => {
    if (!phrase) return;
    removePhrase(phrase).catch(handleError).finally(onRemoved);
  }, [phrase, removePhrase, handleError, onRemoved]);

  return (
    <RemovePhraseMultiConfirmStyled
      key={phrase?.signature}
      onConfirm={onConfirm}
      confirmSteps={[
        locale.confirmStepDeletePhrase,
        locale.confirmStepYesIamSure,
        locale.confirmStepDeleteIt,
      ]}
      cancelStep={locale.confirmStepCancelDeletion}
    />
  );
};

// Styled

const RemovePhraseMultiConfirmStyled = styled(ParanoidConfirmButton)`
    ${nonSelectableContentStyle};

    width: 100%;
    height: 34px;
    display: block;
    cursor: pointer;
    border: none;
    outline: none;
    border-radius: 6px;
    font-size: 16px;
    background-color: ${color.dangerLight};
    color: ${color.textPrimaryLight};

    :hover {
        background-color: ${color.danger};
    }

    :active {
        background-color: ${color.dangerDark};
    }
`;