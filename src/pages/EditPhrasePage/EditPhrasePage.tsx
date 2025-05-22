import { useCallback, useState } from "react";

import { OverflowComponent, StateChangeCallback } from 'Components/Layout/OverflowComponent';
import { useErrorHandler } from "Hooks/useHandleError";
import { useOverflowComponent } from "Hooks/useOverflowComponent";
import { Phrase } from "Hooks/usePhrases";
import { EditPhraseView } from "Views/EditPhraseView";

// Constants

export const EDIT_PHRASE_PAGE_NAME = 'edit-phrase-page';

// Components

export const EditPhrasePage = () => {
  const [shown, setShown] = useState<boolean>(false);
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const { hideComponent } = useOverflowComponent();
  const { handleError } = useErrorHandler();


  const beforeAppearance: StateChangeCallback = useCallback((args) => {
    const phrase = args as Phrase;
    setPhrase(phrase);
    setShown(true);
  }, []);

  const afterDisappearance = useCallback(() => {
    setShown(false);
  }, []);

  const close = useCallback(() => {
    hideComponent(EDIT_PHRASE_PAGE_NAME).catch(handleError)
  }, [hideComponent, handleError]);


  return (
      <OverflowComponent name={EDIT_PHRASE_PAGE_NAME}
                         appearance="right"
                         beforeAppearance={beforeAppearance}
                         afterDisappearance={afterDisappearance}
      >
        {shown && <EditPhraseView phrase={phrase!} onClose={close}/>}
      </OverflowComponent>
  );
};


