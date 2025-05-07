import { useCallback, useState } from 'react';

import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import logo from 'Assets/img/logo.png';
import locale from 'Assets/locale';
import { Button } from 'Components/Controls/Button';
import { DestroyVaultMultiConfirm } from 'Components/Controls/DestroyVaultMultiConfirm';
import { Input } from 'Components/Controls/Input';
import { Page } from 'Components/Layout/Page';
import { Spacer } from 'Components/Layout/Spacer';
import { useErrorHandler } from 'Hooks/useHandleError';
import { InvalidPinError, useVault } from 'Hooks/useVault';
import { ContentContainer, Logo, Prompt, VaultForm } from 'Pages/VaultPages/style';

// Types

interface UnlockVaultFormData {
  pin: string;
}

// Constants

const formValidationSchema = object({
  pin: string().trim().required(locale.validationPinCodeRequired),
}).required();

// Components

export const UnlockVaultPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { unlockVault } = useVault();
  const { handleError } = useErrorHandler();
  const {
    register,
    setValue,
    setError,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<UnlockVaultFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
  });


  const resetLoadingState = useCallback(() => {
    setIsLoading(false);
  }, []);

  const resetFormState = useCallback(() => {
    resetLoadingState();
    reset();
  }, [resetLoadingState, reset]);

  const clearFormFields = useCallback(() => {
    setValue('pin', '');
  }, [setValue]);

  const onSubmit: SubmitHandler<UnlockVaultFormData> = useCallback(({ pin }) => {
    setIsLoading(true);
    unlockVault(pin.trim())
      .then(resetFormState)
      .catch((err) => {
        clearFormFields();
        if (err instanceof Error) {
          handleError(err);
        }
        if (err instanceof InvalidPinError) {
          setError('pin', { message: locale.errorMessageInvalidPinCode });
        }
      })
      .finally(resetLoadingState);
  }, [unlockVault, resetFormState, resetLoadingState, handleError, clearFormFields, setError]);


  return (
    <Page caption="pwdr">
      <ContentContainer>
        <Spacer />
        <Logo src={logo} alt="pwdr-logo" />
        <Spacer />
        <Prompt>
          {locale.unlockVaultPrompt}
        </Prompt>
        <Spacer />
        <VaultForm onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Input type="password" placeholder={locale.placeholderPinCode} {...register('pin')}
                 errors={errors.pin?.message} />
          <Spacer size={5} />
          <Button type="submit" loading={isLoading} disabled={!isValid}>
            {locale.btnUnlock}
          </Button>
        </VaultForm>
        <Spacer size={10} />
        <DestroyVaultWrapper>
          <DestroyVaultMultiConfirm />
        </DestroyVaultWrapper>
      </ContentContainer>
    </Page>
  );
};

// Styled

const DestroyVaultWrapper = styled.div`
    width: 100%;
    padding: 0 25px;
    text-align: end;
`;
