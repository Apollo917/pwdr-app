import { ReactElement, useCallback } from 'react';

import { ButtonProps } from "@mui/material/Button";

import locale from 'Assets/locale';
import { ParanoidConfirmButton } from 'Components/Controls/ParanoidConfirmButton';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useVault } from 'Hooks/useVault';

// Types

type T = (props: ButtonProps) => ReactElement

// Constants

const CANCEL_STEP = locale.confirmStepCancelDestruction;
const CONFIRM_STEPS = [
  locale.confirmStepDestroyVault,
  locale.confirmStepYesIamSure,
  locale.confirmStepDestroyIt,
];

// Components

export const DestroyVaultMultiConfirm: T = ({ ...props }) => {
  const { destroyVault } = useVault();
  const { handleError } = useErrorHandler();

  const onConfirm = useCallback(() => {
    destroyVault().catch(handleError);
  }, [destroyVault, handleError]);

  return (
      <ParanoidConfirmButton
          {...props}
          color="error"
          onConfirm={onConfirm}
          confirmSteps={CONFIRM_STEPS}
          cancelStep={CANCEL_STEP}
      />
  );
};
