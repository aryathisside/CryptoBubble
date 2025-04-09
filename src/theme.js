import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0092FF'
    },
    secondary: {
      main: '#1D3A70'
    },
    background: {
      default: '#F9FAFB',
      paper: '#ffffff'
    },
    success: {
      main: '#1DAB87'
    },
    error: {
      main: '#F35050'
    },
    text: {
      primary: '#6B7280',
      secondary: '#1D3A70'
    },
    warning: {
      main: '#F2BB2E'
    },
    info: {
      main: '#0092FF'
    }
  },
  typography: {
    fontFamily: 'Verdana, Arial'
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: 'transparent'
      }
    },
    MuiTypography: {
      defaultProps: {
        color: 'text.primary'
      }
    }
  }
});
export default theme;
