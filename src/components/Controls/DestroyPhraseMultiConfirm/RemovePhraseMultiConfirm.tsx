import { ReactElement, useCallback } from 'react';

import { ButtonProps } from "@mui/material/Button";

import locale from 'Assets/locale';
import { ParanoidConfirmButton } from 'Components/Controls/ParanoidConfirmButton';
import { useErrorHandler } from 'Hooks/useHandleError';
import { Phrase } from 'Hooks/usePhrases';
import { useVault } from 'Hooks/useVault';

// Types

export interface RemovePhraseMultiConfirmProps extends ButtonProps {
  phrase?: Phrase | null;
  onRemoved: () => void;
}

type T = (props: RemovePhraseMultiConfirmProps) => ReactElement

// Constants

const CANCEL_STEP = locale.confirmStepCancelDeletion;
const CONFIRM_STEPS = [
  locale.confirmStepDeletePhrase,
  locale.confirmStepYesIamSure,
  locale.confirmStepDeleteIt,
];

// Components

export const RemovePhraseMultiConfirm: T = ({ phrase, onRemoved, ...props }) => {
  const { removePhrase } = useVault();
  const { handleError } = useErrorHandler();

  const onConfirm = useCallback(() => {
    if (!phrase) return;
    removePhrase(phrase).catch(handleError).finally(onRemoved);
  }, [phrase, removePhrase, handleError, onRemoved]);

  return (
      <ParanoidConfirmButton
          {...props}
          color="error"
          key={phrase?.signature}
          onConfirm={onConfirm}
          confirmSteps={CONFIRM_STEPS}
          cancelStep={CANCEL_STEP}
      />
  );
};
