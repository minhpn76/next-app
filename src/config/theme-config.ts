import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    // Change the default options of useMediaQuery
    MuiUseMediaQuery: {
      defaultProps: {},
    },
  },
});
