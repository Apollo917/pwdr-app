import { useCallback, useMemo, useState } from 'react';

import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import locale from 'Assets/locale';
import { Button } from 'Components/Controls/Button';
import { CloseButton } from 'Components/Controls/CloseButton';
import { RemovePhraseMultiConfirm } from 'Components/Controls/DestroyPhraseMultiConfirm';
import { Input } from 'Components/Controls/Input';
import { OverflowComponent, StateChangeCallback } from 'Components/Layout/OverflowComponent';
import { Page } from 'Components/Layout/Page';
import { Spacer } from 'Components/Layout/Spacer';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useOverflowComponent } from 'Hooks/useOverflowComponent';
import { EditPhraseData, Phrase } from 'Hooks/usePhrases';
import { useVault } from 'Hooks/useVault';

// Constants

export const EDIT_PHRASE_PAGE_NAME = 'edit-phrase-page';

const formValidationSchema = object({
  label: string()
    .trim()
    .required(locale.validationLabelRequired)
    .max(32, ({ max }) => `${locale.validationMaxLength} ${max}`),
}).required();

// Components

export const EditPhrasePage = () => {
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [phrase, setPhrase] = useState<Phrase | undefined | null>();
  const { editPhrase } = useVault();
  const { hideComponent } = useOverflowComponent();
  const { handleError } = useErrorHandler();
  const { register, setValue, handleSubmit, reset, formState: { isValid, errors } } = useForm<EditPhraseData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
  });


  const resetFormState = useCallback(() => {
    setIsEditLoading(false);
    setPhrase(null);
    reset();
  }, [reset]);

  const close = useCallback(() => {
    hideComponent(EDIT_PHRASE_PAGE_NAME).catch(handleError).finally(resetFormState);
  }, [hideComponent, handleError, resetFormState]);

  const updatePhrase: StateChangeCallback = useCallback((args) => {
    const phrase = args as Phrase;
    setPhrase(phrase);
    setValue('label', phrase?.label ?? '', {});
  }, [setValue]);

  const onEditPhraseSubmit = useCallback((editData: EditPhraseData) => {
    if (!phrase) return;
    setIsEditLoading(true);
    editPhrase(phrase, editData).catch(handleError).finally(close);
  }, [phrase, editPhrase, handleError, close]);

  const headerControls = useMemo(() => {
    return (<CloseButton onClick={close} />);
  }, [close]);


  return (
    <OverflowComponent name={EDIT_PHRASE_PAGE_NAME} beforeAppearance={updatePhrase} appearance="right">
      <Page caption={locale.captionEditPhrase} headerControls={headerControls}>
        <PageContentContainer>
          <PhraseForm onSubmit={handleSubmit(onEditPhraseSubmit)} autoComplete="off">
            <Spacer />
            <Input placeholder={locale.placeholderLabel} {...register('label')} errors={errors.label?.message} />
            <Spacer size={5} />
            <Button type="submit" loading={isEditLoading} disabled={!isValid}>
              {locale.btnEditSave}
            </Button>
          </PhraseForm>
          <RemoveControlsContainer>
            <RemovePhraseMultiConfirm phrase={phrase} onRemoved={close} />
            <Spacer />
          </RemoveControlsContainer>
        </PageContentContainer>
      </Page>
    </OverflowComponent>
  );
};

// Styled

const PageContentContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 10px;
`;

const PhraseForm = styled.form`
    > * {
        width: 100%;
    }
`;

const RemoveControlsContainer = styled.div`
    * > {
        width: 100%;
    }
`;