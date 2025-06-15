import { useCallback } from 'react';

import { PageContentContainer } from "Components/Layout/PageContentContainer";
import { PhraseListItem } from 'Components/PhrasesList/PhraseListItem';
import { useErrorHandler } from "Hooks/useHandleError";
import { useOverflowComponent } from "Hooks/useOverflowComponent";
import { Phrase, usePhrases } from 'Hooks/usePhrases';
import { GENERATE_PASSWORD_PAGE_NAME } from "Pages/GeneratePasswordPage";

// Components

export const PhrasesList = () => {
    const { phrases } = usePhrases();
    const { showComponent } = useOverflowComponent();
    const { handleError } = useErrorHandler();


    const handlePhraseClick = useCallback((phrase: Phrase) => {
        showComponent(GENERATE_PASSWORD_PAGE_NAME, phrase).catch(handleError);
    }, [showComponent, handleError]);

    const renderPhrases = useCallback(() => {
        return phrases
            .sort((p1, p2) => p1.label.localeCompare(p2.label))
            .map((p) => (<PhraseListItem key={p.signature} phrase={p} onClick={handlePhraseClick}/>));
    }, [phrases, handlePhraseClick]);

    return (
        <PageContentContainer>
            {renderPhrases()}
        </PageContentContainer>
    );
};
