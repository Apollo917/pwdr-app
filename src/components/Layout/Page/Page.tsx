import { ReactElement, useMemo } from 'react';

import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';

import { PwdrLogoSvg } from 'Assets/img/PwdrLogoSvg';
import { color } from 'Utils/style';
import { ContainerProps } from 'Utils/types';

// Types

interface PageSectionProps {
  height: number;
}

interface PageStyledProps extends PageSectionProps {
  width: number;
}

export interface PageProps extends ContainerProps {
  caption: string;
  className?: string;
  onClose?: () => void;
  footerControls?: ReactElement;
}

type T = (props: PageProps) => ReactElement;

// Constants

const WORKSPACE_WIDTH = parseInt(import.meta.env.VITE_WORKSPACE_WIDTH ?? 0);
const WORKSPACE_HEIGHT = parseInt(import.meta.env.VITE_WORKSPACE_HEIGHT ?? 0);
const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 55;

// Components

export const Page: T = ({ children, caption, className, onClose, footerControls }) => {

  const contentHeight = useMemo(() => {
    return WORKSPACE_HEIGHT - HEADER_HEIGHT - (footerControls ? FOOTER_HEIGHT : 0);
  }, [footerControls]);

  const renderFooter = useMemo(() => {
    if (footerControls) return <Footer height={FOOTER_HEIGHT}>{footerControls}</Footer>;
  }, [footerControls]);


  return (
      <PageStyled className={className} height={WORKSPACE_HEIGHT} width={WORKSPACE_WIDTH}>
        <Header height={HEADER_HEIGHT}>
          <div>
            <PwdrLogoSvg size={25}/>
            <Typography fontSize={22} fontWeight={500} display="inline" color="#fff">
              {caption}
            </Typography>
          </div>
          {
              onClose && (
                  <IconButtonStyled tabIndex={-1} size="small" aria-label="close page" onClick={onClose}>
                    <Close/>
                  </IconButtonStyled>
              )
          }
        </Header>
        <Content height={contentHeight}>{children}</Content>
        {renderFooter}
      </PageStyled>
  );
};

const PageStyled = styled.div<PageStyledProps>`
    width: ${(p) => p.width}px;
    max-width: ${(p) => p.width}px;
    height: ${(p) => p.height}px;
    max-height: ${(p) => p.height}px;
    background-color: #f9f9f9;
    overflow: hidden;
`;

const Header = styled.header<PageSectionProps>`
    height: ${(p) => p.height}px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 10px;

    color: #fff;
    background-color: ${color.logo};
    box-shadow: 0 1px 10px 0 ${color.shadowDark};
`;

const Content = styled.div<PageSectionProps>`
    height: ${(p) => p.height}px;
`;

const Footer = styled.footer<PageSectionProps>`
    height: ${(p) => p.height}px;
    box-shadow: 0 -1px 10px 0 ${color.shadowDark};
`;

// Styled

const IconButtonStyled = styled(IconButton)`
    color: #b7becb;

    :hover {
        color: #e1e1e1;
    }

    :active {
        color: #fff;
    }
`;
