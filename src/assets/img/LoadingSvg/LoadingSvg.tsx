import { ReactElement, useMemo } from 'react';

import { SvgProps } from 'Utils/types';

// Types

type T = (props: SvgProps) => ReactElement;

// Constants

const viewBoxWidth = 200;
const viewBoxHeight = 200;
const aspectRatio = viewBoxWidth / viewBoxHeight;

const animationDuration = 1.25;

// Components

export const LoadingSvg: T = ({ size = 100, opacity = 1, color = 'currentColor' }) => {

  const width = useMemo(() => {
    return size * aspectRatio;
  }, [size]);

  return (
    <svg
      color={color}
      width={width}
      height={size}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle fill={color} stroke={color} opacity={opacity} r="20" cx="40" cy="65">
        <animate attributeName="cy" calcMode="spline" dur={animationDuration} values="65;135;65;"
                 keySplines=".5 0 .5 1;.5 0 .5 1"
                 repeatCount="indefinite" begin="-.4">
        </animate>
      </circle>
      <circle fill={color} stroke={color} opacity={opacity} r="20" cx="100" cy="65">
        <animate attributeName="cy" calcMode="spline" dur={animationDuration} values="65;135;65;"
                 keySplines=".5 0 .5 1;.5 0 .5 1"
                 repeatCount="indefinite" begin="-.2">
        </animate>
      </circle>
      <circle fill={color} stroke={color} opacity={opacity} r="20" cx="160" cy="65">
        <animate attributeName="cy" calcMode="spline" dur={animationDuration} values="65;135;65;"
                 keySplines=".5 0 .5 1;.5 0 .5 1"
                 repeatCount="indefinite" begin="0">
        </animate>
      </circle>
    </svg>
  );
};
