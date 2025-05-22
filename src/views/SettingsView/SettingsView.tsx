import { ReactElement, SyntheticEvent, useCallback, useState } from "react";

import styled from "@emotion/styled";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import locale from "Assets/locale";
import { DestroyVaultMultiConfirm } from "Components/Controls/DestroyVaultMultiConfirm";
import { Page } from "Components/Layout/Page";
import { PageContentContainer } from "Components/Layout/PageContentContainer";
import { DefaultPwdLengthSettings } from "Components/Settings/DefaultPwdLengthSettings";
import { KeyComplexitySettings } from "Components/Settings/KeyComplexitySettings";
import { PinChangeSettings } from "Components/Settings/PinChangeSettings";


// Types

export interface SettingsViewProps {
  onClose: () => void;
}

type T = (props: SettingsViewProps) => ReactElement;

// Constants

const PWD_LENGTH = 'pwd-length';
const KEY_COMPLEXITY = 'key-complexity';
const PIN_CHANGE = 'pin-change';
const VAULT_DESTRUCTION = 'vault-destruction';

// Components

export const SettingsView: T = ({ onClose }) => {
  const [expanded, setExpanded] = useState<string | false>(false);


  const handleExpansion = useCallback((e: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? e.currentTarget.id : false);
  }, []);


  return (
      <Page caption={locale.captionSettings} onClose={onClose}>
        <PageContentContainerStyled>

          <Accordion expanded={expanded === PWD_LENGTH} onChange={handleExpansion}>
            <AccordionSummary id={PWD_LENGTH} aria-controls={PWD_LENGTH} expandIcon={<ExpandMore/>}>
              <Summary>{locale.captionDefaultPasswordLength}</Summary>
            </AccordionSummary>
            <AccordionDetailsStyled>
              <DefaultPwdLengthSettings/>
            </AccordionDetailsStyled>
          </Accordion>

          <Accordion expanded={expanded === KEY_COMPLEXITY} onChange={handleExpansion}>
            <AccordionSummary id={KEY_COMPLEXITY} aria-controls={KEY_COMPLEXITY} expandIcon={<ExpandMore/>}>
              <Summary>{locale.captionKeyComplexity}</Summary>
            </AccordionSummary>
            <AccordionDetailsStyled>
              <KeyComplexitySettings/>
            </AccordionDetailsStyled>
          </Accordion>

          <Accordion expanded={expanded === PIN_CHANGE} onChange={handleExpansion}>
            <AccordionSummary id={PIN_CHANGE} aria-controls={PIN_CHANGE} expandIcon={<ExpandMore/>}>
              <Summary>{locale.captionPinCodeChange}</Summary>
            </AccordionSummary>
            <AccordionDetailsStyled>
              <PinChangeSettings/>
            </AccordionDetailsStyled>
          </Accordion>

          <Accordion expanded={expanded === VAULT_DESTRUCTION} onChange={handleExpansion}>
            <AccordionSummary id={VAULT_DESTRUCTION} aria-controls={VAULT_DESTRUCTION} expandIcon={<ExpandMore/>}>
              <Summary>{locale.captionDangerZone}</Summary>
            </AccordionSummary>
            <AccordionDetailsStyled>
              <DestroyVaultMultiConfirm variant="contained" fullWidth/>
            </AccordionDetailsStyled>
          </Accordion>

        </PageContentContainerStyled>
      </Page>
  );
}

// Styled

const PageContentContainerStyled = styled(PageContentContainer)`
    height: 100%;
    overflow-y: auto;
`;

const AccordionDetailsStyled = styled(AccordionDetails)`
    padding: 8px;
`;

const Summary = styled.span`
    font-size: 16px;
    font-weight: 500;
`;