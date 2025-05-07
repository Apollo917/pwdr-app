import { ReactElement } from 'react';

import { CloseOutlined } from '@ant-design/icons';

import { color } from 'Assets/style';
import { IconButton } from 'Components/Controls/IconButton';
import { FormButtonProps } from 'Components/Controls/types';

// Types

type T = (props: FormButtonProps) => ReactElement;

// Components

export const CloseButton: T = ({ ...props }) => {
  return (
    <IconButton componentSize="small" {...props}
                color={color.controlSecondaryLight}
                hoverColor={color.controlSecondary}
                activeColor={color.controlSecondaryDark}
    >
      <CloseOutlined />
    </IconButton>
  );
};