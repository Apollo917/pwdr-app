import { PropsWithChildren, ReactElement } from 'react';

import { Property } from 'csstype';

export type ContainerProps = PropsWithChildren<object>;

export type DefaultContextProvider = (props: PropsWithChildren<object>) => ReactElement;

export interface SvgProps {
  size?: number;
  opacity?: number;
  color?: string;
  display?: Property.Display;
}
