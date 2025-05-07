import { ButtonHTMLAttributes } from 'react';

import { ComponentSizeProps } from 'Assets/style';
import { ContainerProps } from 'Utils/types';

export interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ContainerProps, ComponentSizeProps {
  loading?: boolean;
}