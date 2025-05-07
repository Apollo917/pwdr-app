import { ReactElement, useMemo } from 'react';

import styled from '@emotion/styled';

import { PwdrLogoSvg } from 'Assets/img/PwdrLogoSvg';
import { color, nonSelectableContentStyle } from 'Assets/style';
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
  headerControls?: ReactElement;
  footerControls?: ReactElement;
}

type T = (props: PageProps) => ReactElement;

// Constants

const WORKSPACE_WIDTH = parseInt(import.meta.env.VITE_WORKSPACE_WIDTH ?? 0);
const WORKSPACE_HEIGHT = parseInt(import.meta.env.VITE_WORKSPACE_HEIGHT ?? 0);
const HEADER_HEIGHT = 40;
const FOOTER_HEIGHT = 40;

// Components

export const Page: T = ({ children, caption, className, headerControls, footerControls }) => {
  const contentHeight = useMemo(() => {
    return WORKSPACE_HEIGHT - HEADER_HEIGHT - (footerControls ? FOOTER_HEIGHT : 0);
  }, [footerControls]);

  const renderFooter = useMemo(() => {
    if (footerControls) return <Footer height={FOOTER_HEIGHT}>{footerControls}</Footer>;
  }, [footerControls]);

  return (
    <PageStyled className={className} height={WORKSPACE_HEIGHT} width={WORKSPACE_WIDTH}>
      <Header height={HEADER_HEIGHT}>
        <Caption>
          <PwdrLogoSvg size={25} />
          <h1>{caption}</h1>
        </Caption>
        {headerControls}
      </Header>
      <Content height={contentHeight}>{children}</Content>
      {renderFooter}
    </PageStyled>
  );
};

const PageStyled = styled.article<PageStyledProps>`
    width: ${(p) => p.width}px;
    max-width: ${(p) => p.width}px;
    height: ${(p) => p.height}px;
    max-height: ${(p) => p.height}px;
    background-color: ${color.backgroundPrimary};
    overflow: hidden;
`;

const Header = styled.header<PageSectionProps>`
    height: ${(p) => p.height}px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 10px;

    color: ${color.logoLight};
    background-color: ${color.logoDark};
    box-shadow: 0 1px 10px 0 ${color.shadowDark};
`;

const Caption = styled.div`
    ${nonSelectableContentStyle}
    > h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 500;
        display: inline;
    }
`;

const Content = styled.div<PageSectionProps>`
    height: ${(p) => p.height}px;
`;

const Footer = styled.footer<PageSectionProps>`
    height: ${(p) => p.height}px;
    box-shadow: 0 -1px 10px 0 ${color.shadowDark};
`;
