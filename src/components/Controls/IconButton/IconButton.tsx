import { ReactElement } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { LoadingSvg } from 'Assets/img/LoadingSvg';
import { color, ComponentSize, nonSelectableContentStyle } from 'Assets/style';
import { FormButtonProps } from 'Components/Controls/types';

// Types

export interface IconButtonProps extends FormButtonProps {
  color?: string;
  hoverColor?: string;
  activeColor?: string;
}

type T = (props: IconButtonProps) => ReactElement;

// Components

export const IconButton: T = ({ children, loading, type = 'button', ...props }) => {
  return (
    <ButtonStyled type={type} {...props}>
      {loading ? (<LoadingSvg size={35} />) : children}
    </ButtonStyled>
  );
};

// Styled

const sizeStyle = ({ componentSize = 'small' }: FormButtonProps) => {
  const fontSize: Record<ComponentSize, number> = {
    tiny: 18,
    small: 20,
    medium: 26,
    large: 32,
  };

  return css`
      font-size: ${fontSize[componentSize]}px;
  `;
};

const ButtonStyled = styled.button<IconButtonProps>`
    ${nonSelectableContentStyle};
    ${sizeStyle};

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;

    cursor: pointer;
    border: none;

    color: ${p => p.color ?? color.controlSecondaryLight};
    background-color: transparent;

    :hover {
        color: ${p => p.hoverColor ?? color.controlPrimary};
    }

    :active {
        color: ${p => p.activeColor ?? color.controlPrimaryDark};
    }
`;
