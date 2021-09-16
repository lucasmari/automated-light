import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';

const theme = createTheme({
  palette: {
    type: 'dark',
    accent: '#ffc',
  },
});

const Theme = (props) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

export default Theme;
