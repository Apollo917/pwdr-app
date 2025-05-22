import { MouseEventHandler, ReactElement, useCallback, useMemo, useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";

// Types

type T = (props: TextFieldProps) => ReactElement;

// Components

export const PasswordField: T = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword((show) => !show)
  }, []);

  const preventDefault: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
  }, []);

  const visibilityTriggers = useMemo(() => {
    return (
        <InputAdornment position="end">
          <IconButton
              tabIndex={-1}
              size={props.size}
              onClick={handleClickShowPassword}
              onMouseDown={preventDefault}
              onMouseUp={preventDefault}
              edge="end"
              aria-label={
                showPassword ? 'hide' : 'show'
              }
          >
            {showPassword ? <VisibilityOff/> : <Visibility/>}
          </IconButton>
        </InputAdornment>
    )
  }, [showPassword, props, handleClickShowPassword, preventDefault])

  return (
      <TextField {...props} type={showPassword ? "text" : "password"}
                 slotProps={{ input: { endAdornment: visibilityTriggers, } }}/>
  );
}