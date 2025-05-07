import { ReactElement, useMemo } from 'react';

import styled from '@emotion/styled';

import { LoadingSvg } from 'Assets/img/LoadingSvg';
import { color, nonSelectableContentStyle } from 'Assets/style';
import { formControlFontSizeStyle, formControlSizeStyle } from 'Components/Controls/styles';
import { FormButtonProps } from 'Components/Controls/types';

// Types

export interface ButtonProps extends FormButtonProps {
  loadingComponent?: ReactElement;
}

type T = (props: ButtonProps) => ReactElement;

// Components

export const Button: T = ({ children, loading, type = 'button', loadingComponent, ...props }) => {

  const classNames = useMemo(() => {
    const classNames = [];
    if (loading) classNames.push('loading');
    return classNames.join(' ');
  }, [loading]);

  const loadingElement = useMemo(() => {
    return loadingComponent ?? (<LoadingSvg size={35} />);
  }, [loadingComponent]);

  return (
    <ButtonStyled type={type} {...props} className={classNames}>
      {loading ? loadingElement : children}
    </ButtonStyled>
  );
};

const ButtonStyled = styled.button<FormButtonProps>`
    ${formControlSizeStyle}
    ${formControlFontSizeStyle}
    ${nonSelectableContentStyle}

    cursor: pointer;
    background-color: ${color.controlPrimaryLight};
    color: ${color.textPrimaryLight};
    border-radius: 6px;
    border: none;

    &.loading {
        pointer-events: none;
        background-color: ${color.controlPrimaryLight};
    }

    :hover {
        background-color: ${color.controlPrimary};
    }

    :active {
        background-color: ${color.controlPrimaryDark};
    }

    :disabled:not(.loading) {
        opacity: .5;
        background-color: ${color.controlPrimaryLight};
    }
`;
