import { useOverflowComponent } from 'Hooks/useOverflowComponent';
import { usePhrases } from 'Hooks/usePhrases';
import { useVault } from 'Hooks/useVault';
import { AddPhrasePage } from 'Pages/AddPhrasePage';
import { EditPhrasePage } from 'Pages/EditPhrasePage';
import { PhrasesPage } from 'Pages/PhrasesPage';
import { SettingsPage } from 'Pages/SettingsPage';

function App() {
  const { PhrasesContextProvider } = usePhrases();
  const { VaultContextProvider } = useVault();
  const { OverflowComponentContextProvider } = useOverflowComponent();

  return (
    <VaultContextProvider>
      <PhrasesContextProvider>
        <OverflowComponentContextProvider>
          <PhrasesPage />
          <SettingsPage />
          <AddPhrasePage />
          <EditPhrasePage />
        </OverflowComponentContextProvider>
      </PhrasesContextProvider>
    </VaultContextProvider>
  );
}

export default App;
