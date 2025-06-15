import { ReactElement, useMemo } from 'react';

import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';

import { PwdrLogoSvg } from 'Assets/img/PwdrLogoSvg';
import { useGlobalDimensions } from "Hooks/useGlobalDimensions";
import { color } from 'Utils/style';
import { ContainerProps } from 'Utils/types';

// Types

interface PageSectionProps {
  height: number;
}

interface PageStyledProps extends PageSectionProps {
  width: number;
}

interface FooterProps {
  footerControls?: ReactElement;
  dropFooterShadow?: boolean;
}

export interface PageProps extends ContainerProps, FooterProps {
  caption: string;
  className?: string;
  onClose?: () => void;
}

type T = (props: PageProps) => ReactElement;

// Constants

const MAX_WIDTH = '600px';

// Components

export const Page: T = ({ children, caption, className, onClose, footerControls, dropFooterShadow }) => {
  const { width, height } = useGlobalDimensions();

  const renderFooter = useMemo(() => {
    if (!footerControls) return;

    return (
        <Footer dropFooterShadow={dropFooterShadow}>
          <FooterContent>
            {footerControls}
          </FooterContent>
        </Footer>
    )

  }, [dropFooterShadow, footerControls]);


  return (
      <PageStyled className={className} width={width} height={height}>
        <Header>
          <HeaderContent>
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
          </HeaderContent>
        </Header>
        <Content>
          <ContentContent>
            {children}
          </ContentContent>
        </Content>
        {renderFooter}
      </PageStyled>
  );
};

// Styled

const PageStyled = styled.div<PageStyledProps>`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;

    overflow: hidden;
    background-color: #f9f9f9;
`;

const Header = styled.header`
    flex: 0 0 auto;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0 10px;

    color: #fff;
    background-color: ${color.logo};
    box-shadow: 0 1px 10px 0 ${color.shadowDark};
`;

const HeaderContent = styled.div`
    width: 100%;
    max-width: ${MAX_WIDTH};
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Content = styled.div`
    flex: 1 1 auto;
    
    display: flex;
    justify-content: center;

    overflow-y: auto;
`;

const ContentContent = styled.div`
    width: 100%;
    max-width: ${MAX_WIDTH};
    height: 100%;
`;

const Footer = styled.footer<FooterProps>`
    flex: 0 0 auto;
    height: 55px;

    display: flex;
    justify-content: center;

    box-shadow: 0 -1px 10px 0 ${color.shadowDark};
    ${({ dropFooterShadow }) => dropFooterShadow === false ? 'box-shadow: none;' : 'inherit'};
`;

const FooterContent = styled.div`
    width: 100%;
    max-width: ${MAX_WIDTH};
    height: 100%;
`;

const IconButtonStyled = styled(IconButton)`
    color: #b7becb;

    :hover {
        color: #e1e1e1;
    }

    :active {
        color: #fff;
    }
`;
