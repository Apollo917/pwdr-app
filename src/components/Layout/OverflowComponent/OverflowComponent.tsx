import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import styled from '@emotion/styled';

import {
  ComponentVisibilityTrigger,
  OverflowComponentArgs,
  useOverflowComponent,
} from 'Hooks/useOverflowComponent';
import { ContainerProps } from 'Utils/types';

// Types

export type AppearanceType = 'top' | 'bottom' | 'left' | 'right';
export type ComponentState = 'shown' | 'hidden';
export type StateChangeCallback = (args?: OverflowComponentArgs) => void;

interface ComponentStyleProps {
  width?: number;
  height?: number;
  transitionDuration?: number;
}

export interface OverflowComponentProps extends ComponentStyleProps, ContainerProps {
  name: string;
  appearance?: AppearanceType;
  initialState?: ComponentState;
  beforeAppearance?: StateChangeCallback;
  afterAppearance?: StateChangeCallback;
  beforeDisappearance?: StateChangeCallback;
  afterDisappearance?: StateChangeCallback;
}

type T = (props: OverflowComponentProps) => ReactElement;

// Constants

const WORKSPACE_WIDTH = parseInt(import.meta.env.VITE_WORKSPACE_WIDTH ?? 0);
const WORKSPACE_HEIGHT = parseInt(import.meta.env.VITE_WORKSPACE_HEIGHT ?? 0);

// Components

export const OverflowComponent: T = ({
  children,
  name,
  width = WORKSPACE_WIDTH,
  height = WORKSPACE_HEIGHT,
  transitionDuration = 300,
  appearance = 'bottom',
  initialState = 'hidden',
  beforeAppearance,
  afterAppearance,
  beforeDisappearance,
  afterDisappearance,
}) => {
  const [state, setState] = useState<ComponentState>(initialState);
  const { registerComponent, unregisterComponent } = useOverflowComponent();

  const classNames = useMemo(() => {
    return [state, appearance].join(' ');
  }, [state, appearance]);

  const show: ComponentVisibilityTrigger = useCallback((args) => {
    return new Promise<void>((resolve) => {
      if (beforeAppearance) beforeAppearance(args);
      setState('shown');
      setTimeout(() => {
        resolve();
        if (afterAppearance) afterAppearance(args);
      }, transitionDuration);
    });
  }, [beforeAppearance, afterAppearance, transitionDuration]);

  const hide: ComponentVisibilityTrigger = useCallback((args) => {
    return new Promise<void>((resolve) => {
      if (beforeDisappearance) beforeDisappearance(args);
      setState('hidden');
      setTimeout(() => {
        resolve();
        if (afterDisappearance) afterDisappearance(args);
      }, transitionDuration);
    });
  }, [beforeDisappearance, afterDisappearance, transitionDuration]);

  useEffect(() => {
    registerComponent(name, { show, hide });
    return () => unregisterComponent(name);
  }, [name, registerComponent, show, hide, unregisterComponent]);

  return (
    <OverflowComponentStyled
      className={classNames}
      width={width}
      height={height}
      transitionDuration={transitionDuration}
    >
      {children}
    </OverflowComponentStyled>
  );
};

// Styled

const OverflowComponentStyled = styled.div<ComponentStyleProps>`
    position: absolute;
    z-index: 999;
    transition: top ${p => p.transitionDuration}ms ease-out, left ${p => p.transitionDuration}ms ease-in-out;

    &.${'top'} {
        top: -${p => p.height}px;
        left: 0
    }

    &.${'bottom'} {
        top: ${p => p.height}px;
        left: 0;
    }

    &.${'left'} {
        top: 0;
        left: -${p => p.width}px;
    }

    &.${'right'} {
        top: 0;
        left: ${p => p.width}px;
    }

    &.${'shown'} {
        &.${'top'},
        &.${'bottom'} {
            top: 0;
        }

        &.${'left'},
        &.${'right'} {
            left: 0;
        }
    }
`;
