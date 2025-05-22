import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    text: {
      primary: '#1f2421',
      secondary: '#6a7b71'
    },
    primary: {
      main: '#6b4cb9',
      light: '#775abe',
      dark: '#5d41a5',
      contrastText: '#ffffff'
    },
    error: {
      main: '#ef5c60',
      light: '#f27c80',
      dark: '#ec4247',
      contrastText: '#ffffff'
    },
  },
  typography: {
    allVariants: {
      color: '#1f2421'
    }
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          userSelect: 'none'
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        marginDense: {
          marginTop: '0',
          marginBottom: '6px'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        slotProps: {
          formHelperText: {
            sx: {
              mt: 0,
              fontSize: '11px',
            }
          }
        }
      }
    }
  }
});
