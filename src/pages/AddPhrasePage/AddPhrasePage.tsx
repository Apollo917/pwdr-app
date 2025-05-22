import { useCallback, useState } from 'react';

import { OverflowComponent } from 'Components/Layout/OverflowComponent';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useOverflowComponent } from 'Hooks/useOverflowComponent';
import { AddPhraseView } from "Views/AddPhraseView";

// Constants

export const ADD_PHRASE_PAGE_NAME = 'add-phrase-page';

// Components

export const AddPhrasePage = () => {
  const [shown, setShown] = useState<boolean>(false);
  const { hideComponent } = useOverflowComponent();
  const { handleError } = useErrorHandler();


  const beforeAppearance = useCallback(() => {
    setShown(true);
  }, []);

  const afterDisappearance = useCallback(() => {
    setShown(false);
  }, []);

  const close = useCallback(() => {
    hideComponent(ADD_PHRASE_PAGE_NAME).catch(handleError);
  }, [hideComponent, handleError]);


  return (
      <OverflowComponent name={ADD_PHRASE_PAGE_NAME}
                         beforeAppearance={beforeAppearance}
                         afterDisappearance={afterDisappearance}
      >
        {shown && <AddPhraseView onClose={close}/>}
      </OverflowComponent>
  );
};
