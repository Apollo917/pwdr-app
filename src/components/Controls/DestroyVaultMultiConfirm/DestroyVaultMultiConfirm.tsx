import { ReactElement, useCallback, useMemo } from 'react';

import styled from '@emotion/styled';

import locale from 'Assets/locale';
import { color, nonSelectableContentStyle } from 'Assets/style';
import { ParanoidConfirmButton } from 'Components/Controls/ParanoidConfirmButton';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useVault } from 'Hooks/useVault';

// Types

type DisplayStyle = 'outline' | 'button';

export interface DestroyVaultMultiConfirmProps {
  displayStyle?: DisplayStyle;
}

type T = (props: DestroyVaultMultiConfirmProps) => ReactElement

// Constants

const CANCEL_STEP = locale.confirmStepCancelDestruction;
const CONFIRM_STEPS = [
  locale.confirmStepDestroyVault,
  locale.confirmStepYesIamSure,
  locale.confirmStepDestroyIt,
];

// Components

export const DestroyVaultMultiConfirm: T = ({ displayStyle = 'outline' }) => {
  const { destroyVault } = useVault();
  const { handleError } = useErrorHandler();

  const onConfirm = useCallback(() => {
    destroyVault().catch(handleError);
  }, [destroyVault, handleError]);

  const content = useMemo(() => {
    if (displayStyle === 'outline') {
      return (
        <DestroyVaultMultiConfirmOutlined
          onConfirm={onConfirm}
          confirmSteps={CONFIRM_STEPS}
          cancelStep={CANCEL_STEP}
        />
      );
    }

    return (
      <DestroyVaultMultiConfirmButton
        onConfirm={onConfirm}
        confirmSteps={CONFIRM_STEPS}
        cancelStep={CANCEL_STEP}
      />
    );
  }, [displayStyle, onConfirm]);

  return (<>{content}</>);
};

// Styled

const DestroyVaultMultiConfirmOutlined = styled(ParanoidConfirmButton)`
    ${nonSelectableContentStyle};

    cursor: pointer;
    border: none;
    outline: none;
    background-color: transparent;
    color: ${color.dangerLight};

    :hover {
        color: ${color.danger};
    }

    :active {
        color: ${color.dangerDark};
    }
`;

const DestroyVaultMultiConfirmButton = styled(ParanoidConfirmButton)`
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
