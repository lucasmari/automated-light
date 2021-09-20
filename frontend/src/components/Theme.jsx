import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';

const theme = createTheme({
  palette: {
    type: 'dark',
    accent: '#ffc',
  },
});

function Theme({ children }) { return (<ThemeProvider theme={theme}>{children}</ThemeProvider>); }

Theme.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Theme;
