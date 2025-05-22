import { useCallback, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { object, ref, string } from "yup";

import locale from "Assets/locale";
import { PasswordField } from "Components/Controls/PasswordField";
import { useErrorHandler } from "Hooks/useHandleError";
import { InvalidPinError, useVault } from "Hooks/useVault";
import { PIN_CODE } from "Utils/constants";

// Types

interface PinChangeSettingsFormData {
  currentPin: string;
  newPin: string;
  newPinConfirm: string;
}

// Constants

const formValidationSchema = object({
  currentPin: string()
      .trim()
      .required(locale.validationCurrentPinCodeRequired),
  newPin: string()
      .trim()
      .required(locale.validationNewPinCodeRequired)
      .min(PIN_CODE.minLength, ({ min }) => `${locale.validationMinLength} ${min}`),
  newPinConfirm: string()
      .trim()
      .required(locale.validationNewPinCodeConfirmRequired)
      .oneOf([ref('newPin')], locale.validationPinCodeConfirmMustMatch),
}).required();

// Components

export const PinChangeSettings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { changePin, lockVault } = useVault();
  const { handleError } = useErrorHandler();
  const { control, handleSubmit, reset, setError, formState: { isValid } } = useForm<PinChangeSettingsFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
    defaultValues: {
      currentPin: '',
      newPin: '',
      newPinConfirm: ''
    }
  });


  const resetFormTempState = useCallback(() => {
    reset();
    setLoading(false);
  }, [reset]);

  const onSubmit = useCallback(({ currentPin, newPin }: PinChangeSettingsFormData) => {
    setLoading(true);
    changePin(currentPin, newPin)
        .then(lockVault)
        .catch((err: Error) => {
          resetFormTempState();
          if (err instanceof InvalidPinError) {
            setError('currentPin', { message: locale.errorMessageInvalidPinCode });
          } else {
            handleError(err);
          }
        })
        .finally(resetFormTempState);
  }, [changePin, lockVault, resetFormTempState, setError, handleError]);


  return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Controller name="currentPin" control={control} render={({ field, fieldState }) => (
            <PasswordField {...field}
                           error={fieldState.invalid}
                           helperText={fieldState.error?.message ?? ' '}
                           label={locale.labelCurrentPinCode}
                           size="small"
                           margin="dense"
                           fullWidth
            />
        )}/>
        <Controller name="newPin" control={control} render={({ field, fieldState }) => (
            <PasswordField {...field}
                           error={fieldState.invalid}
                           helperText={fieldState.error?.message ?? ' '}
                           label={locale.labelNewPinCode}
                           size="small"
                           margin="dense"
                           fullWidth
            />
        )}/>
        <Controller name="newPinConfirm" control={control} render={({ field, fieldState }) => (
            <PasswordField {...field}
                           error={fieldState.invalid}
                           helperText={fieldState.error?.message ?? ' '}
                           label={locale.labelNewPinCodeConfirm}
                           size="small"
                           margin="dense"
                           fullWidth
            />
        )}/>
        <Button fullWidth type="submit" variant="contained" loading={loading} disabled={!isValid}>
          {locale.btnSaveChanges}
        </Button>
      </Box>
  );
}