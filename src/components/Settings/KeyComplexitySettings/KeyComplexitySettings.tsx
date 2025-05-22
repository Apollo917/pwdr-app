import { useCallback, useMemo, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { object, string } from "yup";

import locale from "Assets/locale";
import { PasswordField } from "Components/Controls/PasswordField";
import { Spacer } from "Components/Layout/Spacer";
import { KeyTimeComplexity } from "Hooks/useCrypto";
import { useErrorHandler } from "Hooks/useHandleError";
import { InvalidPinError, useVault } from "Hooks/useVault";

// Types

interface ComplexityItem {
  label: string;
  value: KeyTimeComplexity;
}

interface DefaultPwdLengthSettingsFormData {
  currentPin: string;
  keyComplexity: KeyTimeComplexity;
}

// Constants

const PWD_COMPLEXITY: ComplexityItem[] = [
  {
    label: 'Fast',
    value: 'fast',
  },
  {
    label: 'Balanced',
    value: 'balanced',
  },
  {
    label: 'Strong',
    value: 'strong',
  },
  {
    label: 'Paranoid',
    value: 'paranoid',
  }
];

const formValidationSchema = object({
  currentPin: string()
      .trim()
      .required(locale.validationCurrentPinCodeRequired),
  keyComplexity: string<KeyTimeComplexity>()
      .trim()
      .required(locale.validationKeyComplexityRequired)
}).required();

// Components

export const KeyComplexitySettings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { keyComplexity, changePin } = useVault();
  const { handleError } = useErrorHandler();
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    setError,
    formState: { isValid }
  } = useForm<DefaultPwdLengthSettingsFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
    defaultValues: {
      currentPin: '',
      keyComplexity: keyComplexity ?? 'balanced'
    }
  });
  const newKeyComplexity = watch('keyComplexity');


  const resetFormTempState = useCallback(() => {
    setValue('currentPin', '');
    setLoading(false);
  }, [setValue]);

  const onSubmit = useCallback(({ keyComplexity, currentPin }: DefaultPwdLengthSettingsFormData) => {
    setLoading(true);
    changePin(currentPin, currentPin, keyComplexity)
        .catch((err: Error) => {
          resetFormTempState();
          if (err instanceof InvalidPinError) {
            setError('currentPin', { message: locale.errorMessageInvalidPinCode });
          } else {
            handleError(err);
          }
        })
        .finally(resetFormTempState);
  }, [changePin, resetFormTempState, setError, handleError]);

  const isSaveActive = useMemo(() => {
    const isChanged = keyComplexity !== newKeyComplexity;
    return isValid && isChanged;
  }, [keyComplexity, newKeyComplexity, isValid]);

  const menuItems = useMemo(() => {
    return PWD_COMPLEXITY.map((c) => (<MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>));
  }, []);


  return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Controller name="keyComplexity" control={control} render={({ field }) => (
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel id="pwd-length-picker">
                {locale.labelKeyComplexity}
              </InputLabel>
              <Select
                  {...field}
                  labelId="pwd-length-picker-label"
                  id="pwd-length-picker"
                  label={locale.labelKeyComplexity}
              >
                {menuItems}
              </Select>
            </FormControl>
        )}/>
        <Spacer size={5}/>
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
        <Button fullWidth type="submit" variant="contained" loading={loading} disabled={!isSaveActive}>
          {locale.btnSaveChanges}
        </Button>
      </Box>
  );
}
