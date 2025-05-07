import { InputHTMLAttributes, ReactElement } from 'react';

import styled from '@emotion/styled';

import { color, ComponentSizeProps } from 'Assets/style';
import { formControlFontSizeStyle, formControlSizeStyle } from 'Components/Controls/styles';

// Types

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, ComponentSizeProps {
  errors?: string;
  displayErrors?: boolean;
}

type T = (props: InputProps) => ReactElement;

// Components

export const Input: T = ({ errors, displayErrors = true, ...props }) => {
  return (
    <>
      <InputStyled {...props} />
      {
        displayErrors && (
          <ErrorsWrapper>
            {errors}
          </ErrorsWrapper>
        )
      }
    </>
  );
};

const InputStyled = styled.input<InputProps>`
    ${formControlSizeStyle}
    ${formControlFontSizeStyle}

    width: 100%;
    border: 1px solid ${color.borderSecondary};
    border-radius: 6px;
    color: ${color.textPrimaryDark};

    :hover {
        border-color: ${color.borderPrimary};
    }

    :focus-visible {
        outline: 1px solid ${color.borderPrimary};
    }
`;

const ErrorsWrapper = styled.span`
    display: block;
    height: 15px;
    padding: 2px 0 0 6px;
    text-align: left;
    font-size: 11px;
    color: ${color.danger};
    font-weight: 500;
`;