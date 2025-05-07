import { ButtonHTMLAttributes, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import locale from 'Assets/locale';

// Types

export interface ParanoidConfirmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onConfirm: () => void;
  confirmSteps?: string[];
  cancelStep?: string;
  confirmTimeout?: number;
  cancelTimeout?: number;
}

type T = (props: ParanoidConfirmButtonProps) => ReactElement;

// Constants

const CONFIRM_TIMEOUT = 2_000;
const CANCEL_TIMEOUT = 2_000;

const CANCEL_STEP_INDEX = 0;
const FIRST_CONFIRM_STEP_INDEX = 1;
const DEFAULT_CANCEL_STEP = locale.confirmStepCancel;
const DEFAULT_CONFIRM_STEPS = [locale.confirmStepConfirm];

// Components

export const ParanoidConfirmButton: T = ({
  onConfirm,
  confirmSteps = DEFAULT_CONFIRM_STEPS,
  cancelStep = DEFAULT_CANCEL_STEP,
  confirmTimeout = CONFIRM_TIMEOUT,
  cancelTimeout = CANCEL_TIMEOUT,
  type = 'button',
  ...props
}) => {
  const cancelTimeoutRef = useRef<NodeJS.Timeout>(null);
  const confirmTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(FIRST_CONFIRM_STEP_INDEX);


  const isFinalStep = useMemo(() => {
    return stepIndex === steps.length - 1;
  }, [stepIndex, steps]);

  const clearTimeouts = useCallback(() => {
    if (cancelTimeoutRef.current) clearTimeout(cancelTimeoutRef.current);
    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
  }, []);

  useEffect(() => {
    setSteps(() => [cancelStep, ...confirmSteps]);
    return () => clearTimeouts();
  }, [confirmSteps, cancelStep, clearTimeouts]);

  const confirm = useCallback(() => {
    clearTimeouts();
    setStepIndex(CANCEL_STEP_INDEX);
    confirmTimeoutRef.current = setTimeout(onConfirm, confirmTimeout);
  }, [clearTimeouts, onConfirm, confirmTimeout]);

  const cancel = useCallback(() => {
    clearTimeouts();
    setStepIndex(FIRST_CONFIRM_STEP_INDEX);
  }, [clearTimeouts]);

  const moveToConfirm = useCallback(() => {
    clearTimeouts();
    setStepIndex(i => i + 1);
    cancelTimeoutRef.current = setTimeout(cancel, cancelTimeout);
  }, [clearTimeouts, cancel, cancelTimeout]);

  const onClick = useCallback(() => {
    const isConfirmStep = stepIndex === steps.length - 1;
    const isCancelStep = stepIndex === CANCEL_STEP_INDEX;

    if (isConfirmStep) {
      confirm();
    } else if (isCancelStep) {
      cancel();
    } else {
      moveToConfirm();
    }
  }, [stepIndex, steps, confirm, cancel, moveToConfirm]);


  return (
    <button {...props} onClick={onClick} type={isFinalStep ? type : 'button'}>
      {steps[stepIndex]}
    </button>
  );
};