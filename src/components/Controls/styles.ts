import { css } from '@emotion/react';

import { ComponentSize, ComponentSizeProps } from 'Assets/style';

export const formControlSizeStyle = ({ componentSize = 'medium' }: ComponentSizeProps) => {

  const height: Record<ComponentSize, number> = {
    tiny: 20,
    small: 25,
    medium: 34,
    large: 40,
  };

  const padding: Record<ComponentSize, string> = {
    tiny: '0 5px',
    small: '0 7px',
    medium: '0 10px',
    large: '0 10px',
  };

  return css`
      height: ${height[componentSize]}px;
      padding: ${padding[componentSize]};
  `;
};

export const formControlFontSizeStyle = ({ componentSize = 'medium' }: ComponentSizeProps) => {

  const fontSizes: Record<ComponentSize, number> = {
    tiny: 12,
    small: 14,
    medium: 16,
    large: 18,
  };

  return css`
      font-size: ${fontSizes[componentSize]}px;
  `;
};