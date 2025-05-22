import { ReactElement, useCallback, useEffect, useRef, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { object, string } from "yup";

import locale from "Assets/locale";
import { PasswordField } from "Components/Controls/PasswordField";
import { Page } from "Components/Layout/Page";
import { PageContentContainer } from "Components/Layout/PageContentContainer";
import { useErrorHandler } from "Hooks/useHandleError";
import { PhraseDuplicationError, useVault } from "Hooks/useVault";

// Types

interface AddPhraseFormData {
  label: string;
  phrase: string;
}

export interface AddPhraseViewProps {
  onClose: () => void;
}

type T = (props: AddPhraseViewProps) => ReactElement;

// Constants

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

export const AddPhraseView: T = ({ onClose }) => {
  const autofocusRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { putPhrase } = useVault();
  const { handleError } = useErrorHandler();
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { isValid },
  } = useForm<AddPhraseFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
    defaultValues: {
      label: '',
      phrase: ''
    }
  });


  useEffect(() => {
    autofocusRef.current?.focus({ preventScroll: true });
  }, []);

  const onSubmit = useCallback(({ label, phrase }: AddPhraseFormData) => {
    setIsLoading(true);
    putPhrase(label.trim(), phrase.trim())
        .then(onClose)
        .catch((err: Error) => {
          if (err instanceof PhraseDuplicationError) {
            setValue('phrase', '');
            setError('phrase', { message: locale.errorMessagePhraseAlreadyExists });
          } else {
            handleError(err);
          }
        })
        .finally(() => setIsLoading(false));
  }, [putPhrase, onClose, handleError, setValue, setError]);


  return (
      <Page caption={locale.captionAddPhrase} onClose={onClose}>
        <PageContentContainer>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Controller name="label" control={control} render={({ field, fieldState }) => (
                <TextField {...field}
                           fullWidth
                           size="small"
                           margin="dense"
                           inputRef={autofocusRef}
                           error={fieldState.invalid}
                           helperText={fieldState.error?.message ?? ' '}
                           label={locale.labelLabel}
                />
            )}/>
            <Controller name="phrase" control={control} render={({ field, fieldState }) => (
                <PasswordField {...field}
                               fullWidth
                               size="small"
                               margin="dense"
                               error={fieldState.invalid}
                               helperText={fieldState.error?.message ?? ' '}
                               label={locale.labelSecretPhrase}
                />
            )}/>
            <Button fullWidth type="submit" variant="contained" loading={isLoading} disabled={!isValid}>
              {locale.btnAddSecretPhrase}
            </Button>
          </Box>
        </PageContentContainer>
      </Page>
  );
}