import { MouseEventHandler, ReactElement, useCallback, useState } from 'react';

import { CopyOutlined, LoadingOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { PwdrLogoSvg } from 'Assets/img/PwdrLogoSvg';
import locale from 'Assets/locale';
import { color } from 'Assets/style';
import { Button } from 'Components/Controls/Button';
import { Input } from 'Components/Controls/Input';
import { Spacer } from 'Components/Layout/Spacer';
import { useErrorHandler } from 'Hooks/useHandleError';
import { Phrase } from 'Hooks/usePhrases';
import { useVault } from 'Hooks/useVault';

// Types

export interface PhraseItemPwdrProps {
  phrase: Phrase;
}

type T = (params: PhraseItemPwdrProps) => ReactElement;

interface PwdrFormData {
  key: string;
}

// Constants

const CLEAR_PWD_TIMEOUT = 3_000;

const formValidationSchema = object({
  key: string().trim().required(locale.validationKeyIsRequired),
}).required();

// Components

export const PhraseItemPwdr: T = ({ phrase }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [pwd, setPwd] = useState<string | null>(null);
  const [pwdCopied, setPwdCopied] = useState<boolean>(false);
  const { getPassword } = useVault();
  const { handleError } = useErrorHandler();
  const { register, handleSubmit, reset, formState: { isValid } } = useForm<PwdrFormData>({
    mode: 'all',
    resolver: yupResolver(formValidationSchema),
  });


  const resetPwdState = useCallback(() => {
    setPwd(null);
    setPwdCopied(false);
  }, []);

  const resetFormState = useCallback(() => {
    setIsLoading(false);
    reset();
  }, [reset]);

  const onSubmit = useCallback(({ key }: PwdrFormData) => {
    setIsLoading(true);
    getPassword(phrase.phrase, key.trim())
      .then(setPwd)
      .then(() => setTimeout(resetPwdState, CLEAR_PWD_TIMEOUT))
      .catch(handleError)
      .finally(resetFormState);
  }, [phrase, getPassword, handleError, resetPwdState, resetFormState]);

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const copyToClipboard = useCallback(() => {
    if (pwd) navigator.clipboard.writeText(pwd).catch(handleError);
    setPwdCopied(true);
  }, [pwd, handleError]);


  return (
    <PhraseItemPwdrStyled onClick={onClick}>
      {pwd ? (
        <PwdControls>
          <p>
            {pwdCopied ? locale.messagePasswordCopied : locale.messagePasswordGenerated}
          </p>
          <Button onClick={copyToClipboard} componentSize="small">
            <CopyOutlined />
          </Button>
        </PwdControls>
      ) : (
        <PwdrForm onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Input type="password"
                 placeholder={locale.placeholderSecretKey}
                 componentSize="small"
                 {...register('key')}
                 displayErrors={false}
          />
          <Spacer size={5} />
          <Button type="submit"
                  componentSize="small"
                  loading={isLoading}
                  disabled={!isValid}
                  loadingComponent={<LoadingOutlined />}
          >
            <PwdrLogoSvg size={20} />
          </Button>
        </PwdrForm>
      )}
    </PhraseItemPwdrStyled>
  );
};

// Styled

const buttonStyle = css`
    min-width: 30px;
    width: 30px;
    max-width: 30px;
    padding: 0;
`;

const PhraseItemPwdrStyled = styled.div`
`;

const PwdrForm = styled.form`
    width: 100%;
    display: flex;
    justify-content: space-between;

    input {
        flex-basis: 100%;
    }

    button {
        ${buttonStyle};
    }
`;

const PwdControls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    button, p {
        display: inline-block;
        margin: 0;
    }

    button {
        ${buttonStyle};
        padding-top: 3px;
        font-size: 16px;
    }

    p {
        font-size: 14px;
        color: ${color.success};
    }
`;