import { ReactElement, useMemo } from "react";

import { FormControl, FormControlProps, InputLabel, InputLabelProps, MenuItem, Select } from "@mui/material";
import { SelectProps } from "@mui/material/Select";

import locale from "Assets/locale";

// Types

export interface PwdLengthPickerProps extends FormControlProps {
  inputLabelProps?: InputLabelProps;
  selectProps?: SelectProps;
}

type T = (props: PwdLengthPickerProps) => ReactElement;

// Constants

const PASSWORD_LENGTHS = [16, 24, 32, 40, 48, 56, 64];

// Controls

export const PwdLengthPicker: T = ({ inputLabelProps, selectProps, ...props }) => {

  const menuItems = useMemo(() => {
    return PASSWORD_LENGTHS.map((v) => (<MenuItem key={v} value={v}>{v}</MenuItem>));
  }, []);


  return (
      <FormControl {...props}>
        <InputLabel {...inputLabelProps} id="pwd-length-picker">
          {locale.labelPasswordLength}
        </InputLabel>
        <Select
            {...selectProps}
            labelId="pwd-length-picker-label"
            id="pwd-length-picker"
            label={locale.labelPasswordLength}
        >
          {menuItems}
        </Select>
      </FormControl>
  );
}
