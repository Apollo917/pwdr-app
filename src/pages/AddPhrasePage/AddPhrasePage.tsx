import { useCallback, useMemo, useState } from 'react';

import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import locale from 'Assets/locale';
import { Button } from 'Components/Controls/Button';
import { CloseButton } from 'Components/Controls/CloseButton';
import { Input } from 'Components/Controls/Input';
import { OverflowComponent } from 'Components/Layout/OverflowComponent';
import { Page } from 'Components/Layout/Page';
import { Spacer } from 'Components/Layout/Spacer';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useOverflowComponent } from 'Hooks/useOverflowComponent';
import { PhraseDuplicationError, useVault } from 'Hooks/useVault';

// Types

interface CreatePhraseFormData {
  label: string;
  phrase: string;
}

// Constants

export const CREATE_PHRASE_PAGE_NAME = 'create-phrase-page';

const formValidationSchema = object({
  label: string()
    .trim()
    .required(locale.validationLabelRequired)
    .max(32, ({ max }) => `${locale.validationMaxLength} ${max}`),
  phrase: string()
    .trim()
    .required(locale.validationPhraseRequired),
}).required();

// Components

export const AddPhrasePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { putPhrase } = useVault();
  const { hideComponent } = useOverflowComponent();
  const { handleError } = useErrorHandler();
  const {
    register,
    setValue,
    setError,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<CreatePhraseFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
  });


  const resetLoadingState = useCallback(() => {
    setIsLoading(false);
  }, []);

  const resetFormState = useCallback(() => {
    resetLoadingState();
    reset();
  }, [reset, resetLoadingState]);

  const close = useCallback(() => {
    hideComponent(CREATE_PHRASE_PAGE_NAME).catch(handleError).finally(resetFormState);
  }, [hideComponent, handleError, resetFormState]);

  const onSubmit = useCallback(({ label, phrase }: CreatePhraseFormData) => {
    setIsLoading(true);
    putPhrase(label.trim(), phrase.trim())
      .then(close)
      .catch((err) => {
        if (err instanceof Error) {
          handleError(err);
        }
        if (err instanceof PhraseDuplicationError) {
          setValue('phrase', '');
          setError('phrase', { message: locale.errorMessagePhraseAlreadyExists });
        }
      })
      .finally(resetLoadingState);
  }, [putPhrase, close, resetLoadingState, handleError, setValue, setError]);

  const headerControls = useMemo(() => {
    return (<CloseButton onClick={close} />);
  }, [close]);


  return (
    <OverflowComponent name={CREATE_PHRASE_PAGE_NAME}>
      <Page caption={locale.captionAddPhrase} headerControls={headerControls}>
        <AddPhraseForm onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Spacer />
          <Input placeholder={locale.placeholderLabel} {...register('label')} errors={errors.label?.message} />
          <Spacer size={5} />
          <Input type="password" placeholder={locale.placeholderPhrase} {...register('phrase')}
                 errors={errors.phrase?.message} />
          <Spacer size={5} />
          <Button type="submit" loading={isLoading} disabled={!isValid}>
            {locale.btnAdd}
          </Button>
        </AddPhraseForm>
      </Page>
    </OverflowComponent>
  );
};

// Styled

const AddPhraseForm = styled.form`
    padding: 0 10px;

    > * {
        width: 100%;
    }
`;