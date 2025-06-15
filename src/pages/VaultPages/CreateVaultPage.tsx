import { useCallback, useEffect, useRef, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from "@mui/material";
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { object, ref, string } from 'yup';

import locale from 'Assets/locale';
import { PasswordField } from "Components/Controls/PasswordField";
import { Page } from 'Components/Layout/Page';
import { useErrorHandler } from 'Hooks/useHandleError';
import { useVault } from 'Hooks/useVault';
import { VaultPageLayout } from "Pages/VaultPages/VaultPageLayout";
import { PIN_CODE } from "Utils/constants";


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
      .min(PIN_CODE.minLength, ({ min }) => `${locale.validationMinLength} ${min}`),
  pinConfirm: string()
      .trim()
      .required(locale.validationPinCodeConfirmRequired)
      .oneOf([ref('pin')], locale.validationPinCodeConfirmMustMatch),
}).required();

// Components

export const CreateVaultPage = () => {
  const autofocusRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { createVault } = useVault();
  const { handleError } = useErrorHandler();
  const { control, handleSubmit, reset, formState: { isValid } } = useForm<CreateVaultFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
    defaultValues: {
      pin: '',
      pinConfirm: ''
    }
  });


  useEffect(() => {
    autofocusRef.current?.focus();
  }, []);

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
        <VaultPageLayout prompt={locale.createNewVaultPrompt}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} width="100%" maxWidth="400px" autoComplete="off">
            <Controller name="pin" control={control} render={({ field, fieldState }) => (
                <PasswordField {...field}
                               inputRef={autofocusRef}
                               error={fieldState.invalid}
                               helperText={fieldState.error?.message ?? ' '}
                               label={locale.labelPinCode}
                               size="small"
                               margin="dense"
                               fullWidth
                />
            )}/>
            <Controller name="pinConfirm" control={control} render={({ field, fieldState }) => (
                <PasswordField {...field}
                               error={fieldState.invalid}
                               helperText={fieldState.error?.message ?? ' '}
                               label={locale.labelPinCodeConfirm}
                               size="small"
                               margin="dense"
                               fullWidth
                />
            )}/>
            <Button type="submit" variant="contained" loading={isLoading} disabled={!isValid} fullWidth>
              {locale.btnCreate}
            </Button>
          </Box>
        </VaultPageLayout>
      </Page>
  );
};
