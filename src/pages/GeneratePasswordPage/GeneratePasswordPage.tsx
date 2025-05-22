import { useCallback, useState } from 'react';

import { OverflowComponent, StateChangeCallback } from 'Components/Layout/OverflowComponent';
import { useErrorHandler } from "Hooks/useHandleError";
import { useOverflowComponent } from "Hooks/useOverflowComponent";
import { Phrase } from "Hooks/usePhrases";
import { GeneratePasswordView } from "Views/GeneratePasswordView";

// Constants

export const GENERATE_PASSWORD_PAGE_NAME = 'generate-password-page';

// Components

export const GeneratePasswordPage = () => {
  const [shown, setShown] = useState<boolean>(false);
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const { hideComponent } = useOverflowComponent();
  const { handleError } = useErrorHandler();

  const beforeAppearance: StateChangeCallback = useCallback((args) => {
    const phrase = args as Phrase;
    setPhrase(phrase);
    setShown(true);
  }, []);

  const afterDisappearance: StateChangeCallback = useCallback(() => {
    setShown(false);
  }, []);

  const close = useCallback(() => {
    hideComponent(GENERATE_PASSWORD_PAGE_NAME).catch(handleError);
  }, [hideComponent, handleError]);


  return (
      <OverflowComponent name={GENERATE_PASSWORD_PAGE_NAME}
                         beforeAppearance={beforeAppearance}
                         afterDisappearance={afterDisappearance}
                         appearance="right"
                         animationDuration={150}
      >
        {shown && <GeneratePasswordView phrase={phrase!} onClose={close}/>}
      </OverflowComponent>
  );
};

