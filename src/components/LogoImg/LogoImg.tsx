import { ReactElement } from "react";

import styled from "@emotion/styled";

import logo from "Assets/img/logo.png";

// Types

export interface LogoImgProps {
    size?: number;
}

type T = (props: LogoImgProps) => ReactElement;

// Components

export const LogoImg: T = ({size = 130}) => {
    return (<Logo src={logo} alt="pwdr-logo" size={size}/>)
}

// Styled

export const Logo = styled.img<LogoImgProps>`
    width: ${p => p.size}px;
`;