import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";

import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { object, string } from "yup";

import locale from "Assets/locale";
import { RemovePhraseMultiConfirm } from "Components/Controls/DestroyPhraseMultiConfirm";
import { Page } from "Components/Layout/Page";
import { PageContentContainer } from "Components/Layout/PageContentContainer";
import { useErrorHandler } from "Hooks/useHandleError";
import { EditPhraseData, Phrase } from "Hooks/usePhrases";
import { useVault } from "Hooks/useVault";


// Types

export interface EditPhraseViewProps {
  phrase: Phrase;
  onClose: () => void;
}

type T = (props: EditPhraseViewProps) => ReactElement;

// Constants

const formValidationSchema = object({
  label: string()
      .trim()
      .required(locale.validationLabelRequired)
      .max(32, ({ max }) => `${locale.validationMaxLength} ${max}`),
}).required();

// Components

export const EditPhraseView: T = ({ phrase, onClose }) => {
  const autofocusRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { editPhrase } = useVault();

  const { handleError } = useErrorHandler();
  const { control, watch, handleSubmit, formState: { isValid } } = useForm<EditPhraseData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
    defaultValues: {
      label: phrase.label
    }
  });
  const newLabelVal = watch('label');


  useEffect(() => {
    autofocusRef.current?.focus({ preventScroll: true });
  }, []);

  const isSaveActive = useMemo(() => {
    const isChanged = phrase?.label !== newLabelVal;
    return isValid && isChanged;
  }, [isValid, phrase, newLabelVal]);

  const onSubmit = useCallback((editData: EditPhraseData) => {
    if (!phrase) return;
    setIsLoading(true);
    editPhrase(phrase, editData)
        .then(onClose)
        .catch(handleError)
        .finally(() => setIsLoading(false));
  }, [phrase, editPhrase, onClose, handleError]);


  return (
      <Page caption={locale.captionEditPhrase} onClose={onClose}>
        <PageContentContainerStyled>
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
                           slotProps={{
                             inputLabel: {
                               shrink: !!phrase?.label
                             }
                           }}
                />
            )}/>
            <Button type="submit" variant="contained" loading={isLoading} disabled={!isSaveActive} fullWidth>
              {locale.btnSaveChanges}
            </Button>
          </Box>
          <RemovePhraseMultiConfirm phrase={phrase} onRemoved={onClose} variant="contained" fullWidth/>
        </PageContentContainerStyled>
      </Page>
  );
}

// Styled

const PageContentContainerStyled = styled(PageContentContainer)`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
