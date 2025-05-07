import styled from '@emotion/styled';

import { color, nonSelectableContentStyle } from 'Assets/style';

// Style

export const ContentContainer = styled.div`
    text-align: center;
`;

export const Logo = styled.img`
    width: 130px;
`;

export const Prompt = styled.p`
    ${nonSelectableContentStyle};
    font-size: 22px;
    font-weight: 500;
    margin: 0;
    color: ${color.textPrimaryDark};
`;

export const VaultForm = styled.form`
    width: 100%;
    padding: 0 25px;

    > * {
        width: 100%;
    }
`;