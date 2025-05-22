import { ReactElement } from "react";

import styled from "@emotion/styled";
import { Typography } from "@mui/material";

import { Spacer } from "Components/Layout/Spacer";
import { LogoImg } from "Components/LogoImg";
import { ContainerProps } from "Utils/types";

// Types

export interface VaultPageLayoutProps extends ContainerProps {
  prompt: string;
}

type T = (props: VaultPageLayoutProps) => ReactElement;

// Components

export const VaultPageLayout: T = ({ prompt, children }) => {
  return (
      <VaultPageLayoutStyled>
        <Spacer/>
        <LogoImg/>
        <Spacer/>
        <Typography fontSize={22} fontWeight={500}>
          {prompt}
        </Typography>
        <Spacer/>
        {children}
      </VaultPageLayoutStyled>
  )
};

// Styled

const VaultPageLayoutStyled = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 25px;
`;
