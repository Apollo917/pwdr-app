import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import styled from '@emotion/styled';

import { useGlobalDimensions } from "Hooks/useGlobalDimensions";
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

interface SizeStyleProps {
  width: number;
  height: number;
}

interface PositionStyleProps {
  left: number;
}

interface ComponentStyleProps {
  animationDuration?: number;
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

// Components

export const OverflowComponent: T = ({
                                       children,
                                       name,
                                       animationDuration = 300,
                                       appearance = 'bottom',
                                       initialState = 'hidden',
                                       beforeAppearance,
                                       afterAppearance,
                                       beforeDisappearance,
                                       afterDisappearance,
                                     }) => {
  const [state, setState] = useState<ComponentState>(initialState);
  const { width, height, left } = useGlobalDimensions();
  const { registerComponent, unregisterComponent } = useOverflowComponent();


  const classNames = useMemo(() => {
    return [name, state, appearance].join(' ');
  }, [name, state, appearance]);

  const show: ComponentVisibilityTrigger = useCallback((args) => {
    return new Promise<void>((resolve) => {
      if (beforeAppearance) beforeAppearance(args);
      setState('shown');
      setTimeout(() => {
        resolve();
        if (afterAppearance) afterAppearance(args);
      }, animationDuration);
    });
  }, [beforeAppearance, afterAppearance, animationDuration]);

  const hide: ComponentVisibilityTrigger = useCallback((args) => {
    return new Promise<void>((resolve) => {
      if (beforeDisappearance) beforeDisappearance(args);
      setState('hidden');
      setTimeout(() => {
        resolve();
        if (afterDisappearance) afterDisappearance(args);
      }, animationDuration);
    });
  }, [beforeDisappearance, afterDisappearance, animationDuration]);

  useEffect(() => {
    registerComponent(name, { show, hide });
    return () => unregisterComponent(name);
  }, [name, registerComponent, show, hide, unregisterComponent]);

  return (
      <OverflowComponentStyled
          className={classNames}
          width={width}
          height={height}
          left={left}
          animationDuration={animationDuration}
      >
        {children}
      </OverflowComponentStyled>
  );
};

// Styled

const OverflowComponentStyled = styled.div<ComponentStyleProps & SizeStyleProps & PositionStyleProps>`
    position: absolute;
    width: ${p => p.width}px;
    height: ${p => p.height}px;
    z-index: 999;
    transition: top ${p => p.animationDuration}ms ease-out, left ${p => p.animationDuration}ms ease-in-out;

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
