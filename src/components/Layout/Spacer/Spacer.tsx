import { ReactElement } from 'react';

import styled from '@emotion/styled';

// Types

export interface SpacerProps {
  size?: number;
}

type T = (props: SpacerProps) => ReactElement;

// Components

export const Spacer: T = ({ size = 16 }) => {
  return (<SpacerStyled size={size} />);
};

const SpacerStyled = styled.div<SpacerProps>`
    height: ${p => p.size}px;
    width: ${p => p.size}px;
`;
