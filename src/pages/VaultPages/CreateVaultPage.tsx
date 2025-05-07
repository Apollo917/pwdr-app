import { useCallback, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { object, ref, string } from 'yup';

import logo from 'Assets/img/logo.png';
import locale from 'Assets/locale';
import { Button } from 'Components/Controls/Button';
import { Input } from 'Components/Controls/Input';
import { Page } from 'Components/Layout/Page';
import { Spacer } from 'Components/Layout/Spacer';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useVault } from 'Hooks/useVault';
import { ContentContainer, Logo, Prompt, VaultForm } from 'Pages/VaultPages/style';

// Types

interface CreateVaultFormData {
  pin: string;
  pinConfirm: string;
}

// Constants

const formValidationSchema = object({
  pin: string()
    .trim()
    .required(locale.validationPinCodeRequired)
    .min(8, ({ min }) => `${locale.validationMinLength} ${min}`),
  pinConfirm: string()
    .trim()
    .required(locale.validationPinCodeConfirmRequired)
    .oneOf([ref('pin')], locale.validationPinCodeConfirmMustMatch),
}).required();

// Components

export const CreateVaultPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { createVault } = useVault();
  const { handleError } = useErrorHandler();
  const { register, handleSubmit, reset, formState: { isValid, errors } } = useForm<CreateVaultFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
  });


  const resetFormState = useCallback(() => {
    setIsLoading(false);
    reset();
  }, [reset]);

  const onSubmit: SubmitHandler<CreateVaultFormData> = useCallback(({ pin }) => {
    setIsLoading(true);
    createVault(pin.trim()).catch(handleError).finally(resetFormState);
  }, [createVault, handleError, resetFormState]);

  return (
    <Page caption="pwdr">
      <ContentContainer>
        <Spacer />
        <Logo src={logo} alt="pwdr-logo" />
        <Spacer />
        <Prompt>
          {locale.createNewVaultPrompt}
        </Prompt>
        <Spacer />
        <VaultForm onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Input type="password" placeholder={locale.placeholderPinCode} {...register('pin')}
                 errors={errors.pin?.message} />
          <Spacer size={5} />
          <Input type="password" placeholder={locale.placeholderPinCodeConfirm} {...register('pinConfirm')}
                 errors={errors.pinConfirm?.message}
          />
          <Spacer size={5} />
          <Button type="submit" loading={isLoading} disabled={!isValid}>
            {locale.btnCreate}
          </Button>
        </VaultForm>
      </ContentContainer>
    </Page>
  );
};
