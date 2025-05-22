import { useCallback, useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from "@mui/material";
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { object, string } from 'yup';

import locale from 'Assets/locale';
import { DestroyVaultMultiConfirm } from 'Components/Controls/DestroyVaultMultiConfirm';
import { PasswordField } from "Components/Controls/PasswordField";
import { Page } from 'Components/Layout/Page';
import { Spacer } from "Components/Layout/Spacer";
import { useErrorHandler } from 'Hooks/useHandleError';
import { InvalidPinError, useVault } from 'Hooks/useVault';
import { VaultPageLayout } from "Pages/VaultPages/VaultPageLayout";

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
  const autofocusRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { unlockVault } = useVault();
  const { handleError } = useErrorHandler();
  const { control, handleSubmit, setValue, setError, reset, formState: { isValid }, } = useForm<UnlockVaultFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
    defaultValues: {
      pin: ''
    }
  });


  useEffect(() => {
    autofocusRef.current?.focus()
  }, []);

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
        .catch((err: Error) => {
          clearFormFields();
          if (err instanceof InvalidPinError) {
            setError('pin', { message: locale.errorMessageInvalidPinCode });
          } else {
            handleError(err);
          }
        })
        .finally(resetLoadingState);
  }, [unlockVault, resetFormState, resetLoadingState, handleError, clearFormFields, setError]);


  return (
      <Page caption="pwdr">
        <VaultPageLayout prompt={locale.unlockVaultPrompt}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
            <Button type="submit" variant="contained" loading={isLoading} disabled={!isValid} fullWidth>
              {locale.btnUnlock}
            </Button>
          </Box>
          <Spacer size={10}/>
          <DestroyVaultContainer>
            <DestroyVaultMultiConfirm size="small"/>
          </DestroyVaultContainer>
        </VaultPageLayout>
      </Page>
  );
};

// Styled

const DestroyVaultContainer = styled.div`
    width: 100%;
    text-align: end;
`;
