import { css } from '@emotion/react';

// Types

export type ComponentSize = 'tiny' | 'small' | 'medium' | 'large';

export interface ComponentSizeProps {
  componentSize?: ComponentSize;
}

// Constants

export const color: Record<string, string> = {
  logoLight: '#fff',
  logoDark: '#6776e4',

  controlPrimary: '#6B4CB9',
  controlPrimaryLight: '#775abe',
  controlPrimaryDark: '#5d41a5',

  controlSecondary: '#e1e1e1',
  controlSecondaryLight: '#B7BECB',
  controlSecondaryDark: '#fff',

  backgroundPrimary: '#f9f9f9',
  backgroundSecondary: '#6B4CB9',

  shadowDark: '#B7BECB',

  danger: `#ef5c60`,
  dangerLight: `#f27c80`,
  dangerExtraLight: '#f8b9bb',
  dangerDark: `#ec4247`,

  textPrimaryLight: '#fff',
  textSecondaryLight: '#f1f1f1',

  textPrimaryDark: '#1F2421',
  textSecondaryDark: '#6a7b71',

  borderPrimary: '#b8b3cb',
  borderSecondary: '#d5d2e0',

  success: '#23c235',
};

// Style

export const nonSelectableContentStyle = () => css`
    user-select: none;
`;
