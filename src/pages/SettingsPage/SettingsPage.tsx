import { useCallback, useState } from 'react';

import { OverflowComponent } from 'Components/Layout/OverflowComponent';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useOverflowComponent } from 'Hooks/useOverflowComponent';
import { SettingsView } from "Views/SettingsView";

// Constants

export const SETTINGS_PAGE_NAME = 'settings-page';

// Components

export const SettingsPage = () => {
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
    hideComponent(SETTINGS_PAGE_NAME).catch(handleError);
  }, [hideComponent, handleError]);


  return (
      <OverflowComponent name={SETTINGS_PAGE_NAME}
                         beforeAppearance={beforeAppearance}
                         afterDisappearance={afterDisappearance}
      >
        {shown && <SettingsView onClose={close}/>}
      </OverflowComponent>
  );
};
