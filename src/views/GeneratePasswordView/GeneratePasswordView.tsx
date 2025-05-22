import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check } from '@mui/icons-material';
import { Alert, Box, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { number, object, string } from "yup";

import locale from 'Assets/locale';
import { PasswordField } from "Components/Controls/PasswordField";
import { PwdLengthPicker } from "Components/Controls/PwdLengthPicker";
import { Page } from 'Components/Layout/Page';
import { PageContentContainer } from "Components/Layout/PageContentContainer";
import { Spacer } from "Components/Layout/Spacer";
import { useErrorHandler } from 'Hooks/useHandleError';
import { Phrase } from "Hooks/usePhrases";
import { useSettings } from "Hooks/useSettings";
import { useVault } from "Hooks/useVault";
import { PASSWORD } from "Utils/constants";

// Types

interface PwdrFormData {
  key: string;
  pwdLength: number;
}

export interface GeneratePasswordViewProps {
  phrase: Phrase;
  onClose: () => void;
}

type T = (props: GeneratePasswordViewProps) => ReactElement;

// Constants

const CLEAR_PWD_TIMEOUT = 3_000;
const CLEAR_PWD_COPIED_MESSAGE_TIMEOUT = 1_000;


const formValidationSchema = object({
  key: string().trim().required(locale.validationKeyIsRequired),
  pwdLength: number()
      .min(PASSWORD.minLength, ({ min }) => `${locale.validationMinPasswordLength} ${min}`)
      .max(PASSWORD.maxLength, ({ max }) => `${locale.validationMinPasswordLength} ${max}`)
      .required(locale.validationPasswordLengthRequired)
}).required();

// Components

export const GeneratePasswordView: T = ({ phrase, onClose }) => {
  const autofocusRef = useRef<HTMLDivElement>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [generationInProgress, setGenerationInProgress] = useState(false);
  const [pwd, setPwd] = useState<string | null>(null);
  const [pwdCopied, setPwdCopied] = useState<boolean>(false);
  const { handleError } = useErrorHandler();
  const { settings } = useSettings();
  const { generatePassword } = useVault();
  const { control, setValue, handleSubmit, formState: { isValid } } = useForm<PwdrFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
    defaultValues: {
      key: '',
      pwdLength: settings.defaultPwdLength
    }
  });


  const focus = useCallback(() => {
    autofocusRef.current?.focus({ preventScroll: true });
  }, [])

  useEffect(() => {
    focus();
  }, [focus]);

  const resetState = useCallback(() => {
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    setValue('key', '', { shouldValidate: true });
    setPwd(null);
    focus();
  }, [focus, setValue]);

  const copyPwd = useCallback(() => {
    if (!pwd) return;

    navigator.clipboard.writeText(pwd).catch(handleError);
    setPwdCopied(true);
    setTimeout(() => setPwdCopied(false), CLEAR_PWD_COPIED_MESSAGE_TIMEOUT);
    resetState();
  }, [handleError, pwd, resetState]);

  const onSubmit = useCallback(({ key, pwdLength }: PwdrFormData) => {
    if (!phrase) return;

    if (pwd) return copyPwd();

    setGenerationInProgress(true);
    generatePassword(phrase.phrase, key.trim(), pwdLength)
        .then(setPwd)
        .then(() => resetTimeoutRef.current = setTimeout(resetState, CLEAR_PWD_TIMEOUT))
        .catch(handleError)
        .finally(() => setGenerationInProgress(false));
  }, [phrase, pwd, generatePassword, handleError, copyPwd, resetState]);


  return (
      <Page caption={locale.captionGeneratePassword} onClose={onClose}>
        <PageContentContainer>
          <PhraseLabel>{phrase?.label}</PhraseLabel>
          <Spacer size={10}/>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Controller name="key" control={control} render={({ field }) => (
                <PasswordField {...field}
                               inputRef={autofocusRef}
                               label={locale.labelSecretKey}
                               size="small"
                               margin="dense"
                               fullWidth
                />
            )}/>
            <Controller name="pwdLength" control={control} render={({ field }) => (
                <PwdLengthPicker {...field} fullWidth size="small" margin="normal" selectProps={field}/>
            )}/>

            {(pwd) ? (
                <Button type="submit" variant="contained" fullWidth>
                  {locale.btnCopyPassword}
                </Button>
            ) : (
                <Button type="submit" variant="contained" fullWidth
                        loading={generationInProgress}
                        disabled={!(isValid && phrase)}
                >
                  {generationInProgress ? locale.btnGeneratingPassword : locale.btnGeneratePassword}
                </Button>
            )
            }
          </Box>
          {
              pwdCopied && (
                  <>
                    <Spacer/>
                    <AlertStyled icon={<Check fontSize="inherit"/>} variant="outlined" severity="info">
                      {locale.messagePasswordCopied}
                    </AlertStyled>
                  </>
              )
          }
        </PageContentContainer>
      </Page>
  );
}

// Styled

const PhraseLabel = styled.h1`
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    opacity: 0.6;
`;

const AlertStyled = styled(Alert)`
    display: flex;
    align-items: center;
    justify-content: center;
`;