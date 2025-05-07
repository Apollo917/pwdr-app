import { useCallback, useState } from 'react';

import styled from '@emotion/styled';

import { PhraseItem } from 'Components/PhrasesList/PhraseItem';
import { Phrase, usePhrases } from 'Hooks/usePhrases';

// Components

export const PhrasesList = () => {
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const { phrases } = usePhrases();

  const onPhraseSelected = useCallback((phrase: Phrase) => {
    setSelectedPhrase(phrase);
  }, []);

  const onPhraseUnselected = useCallback(() => {
    setSelectedPhrase(null);
  }, []);

  const renderPhrases = useCallback(() => {
    return phrases
      .sort((p1, p2) => p1.label.localeCompare(p2.label))
      .map((p) => (
        <PhraseItem
          key={p.signature}
          phrase={p}
          onSelected={onPhraseSelected}
          onUnselected={onPhraseUnselected}
          selected={selectedPhrase === p}
        />
      ));
  }, [phrases, onPhraseSelected, onPhraseUnselected, selectedPhrase]);

  return (
    <PhrasesListStyled>
      {renderPhrases()}
    </PhrasesListStyled>
  );
};

const PhrasesListStyled = styled.div`
    height: 100%;
    overflow-y: auto;
    padding: 10px 5px;
`;
