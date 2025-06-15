import { ThemeProvider } from "@mui/material";

import { useGlobalDimensions } from "Hooks/useGlobalDimensions";
import { useOverflowComponent } from 'Hooks/useOverflowComponent';
import { usePhrases } from 'Hooks/usePhrases';
import { useSettings } from "Hooks/useSettings";
import { useVault } from 'Hooks/useVault';
import { AddPhrasePage } from 'Pages/AddPhrasePage';
import { EditPhrasePage } from 'Pages/EditPhrasePage';
import { GeneratePasswordPage } from "Pages/GeneratePasswordPage";
import { PhrasesPage } from 'Pages/PhrasesPage';
import { SettingsPage } from 'Pages/SettingsPage';
import { theme } from "Utils/theme";

function App() {
  const { GlobalDimensionsContextProvider } = useGlobalDimensions();
  const { VaultContextProvider } = useVault();
  const { SettingsContextProvider } = useSettings();
  const { PhrasesContextProvider } = usePhrases();
  const { OverflowComponentContextProvider } = useOverflowComponent();

  return (
      <GlobalDimensionsContextProvider>
        <ThemeProvider theme={theme}>
          <SettingsContextProvider>
            <PhrasesContextProvider>
              <VaultContextProvider>
                <OverflowComponentContextProvider>
                  <PhrasesPage/>
                  <SettingsPage/>
                  <AddPhrasePage/>
                  <EditPhrasePage/>
                  <GeneratePasswordPage/>
                </OverflowComponentContextProvider>
              </VaultContextProvider>
            </PhrasesContextProvider>
          </SettingsContextProvider>
        </ThemeProvider>
      </GlobalDimensionsContextProvider>
  );
}

export default App;
