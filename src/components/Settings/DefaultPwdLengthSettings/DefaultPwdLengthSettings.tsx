import { useCallback, useMemo, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { number, object } from "yup";

import locale from "Assets/locale";
import { PwdLengthPicker } from "Components/Controls/PwdLengthPicker";
import { useErrorHandler } from "Hooks/useHandleError";
import { useSettings } from "Hooks/useSettings";
import { PASSWORD } from "Utils/constants";

// Types

interface DefaultPwdLengthSettingsFormData {
  pwdLength: number;
}

// Constants

const formValidationSchema = object({
  pwdLength: number()
      .min(PASSWORD.minLength, ({ min }) => `${locale.validationMinPasswordLength} ${min}`)
      .max(PASSWORD.maxLength, ({ max }) => `${locale.validationMinPasswordLength} ${max}`)
      .required(locale.validationPasswordLengthRequired)
}).required();

// Components

export const DefaultPwdLengthSettings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { settings, updateSettings } = useSettings();
  const { handleError } = useErrorHandler();
  const { control, watch, handleSubmit, formState: { isValid } } = useForm<DefaultPwdLengthSettingsFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
    defaultValues: {
      pwdLength: settings.defaultPwdLength
    }
  });
  const newPwdLength = watch('pwdLength');


  const isSaveActive = useMemo(() => {
    const isChanged = settings?.defaultPwdLength !== newPwdLength;
    return isValid && isChanged;
  }, [settings, newPwdLength, isValid]);

  const onSubmit = useCallback(({ pwdLength }: DefaultPwdLengthSettingsFormData) => {
    setLoading(true);
    updateSettings({ ...settings, defaultPwdLength: pwdLength })
        .catch(handleError)
        .finally(() => setLoading(false))
  }, [settings, updateSettings, handleError]);


  return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Controller name="pwdLength" control={control} render={({ field }) => (
            <PwdLengthPicker fullWidth size="small" margin="normal" selectProps={field}/>
        )}/>
        <Button fullWidth type="submit" variant="contained" loading={loading} disabled={!isSaveActive}>
          {locale.btnSaveChanges}
        </Button>
      </Box>
  );
}
