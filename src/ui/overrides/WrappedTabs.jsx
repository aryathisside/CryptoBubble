import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Helper from '../../utils/Helper';
import useConfigStore from '../../store/useConfigStore';

// Wrapper container that enables wrapping of tabs
export const WrappedTabsContainer = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap', // Enables tabs to wrap on new lines
       
        gap: 1, // Space between tabs
        padding: 0,
      }}
    >
      {children}
    </Box>
  );
};



// Styled individual tab with responsive flex behavior
export const WrappedTab = styled((props) => <Tab disableRipple {...props} />, { shouldForwardProp: (props) => props !== 'variant' })(
  ({ theme, variant = 'buy' }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightNormal,
    fontSize: theme.typography.pxToRem(14),
    padding: theme.spacing(1, 1),
    borderRadius: '8px',
    background: '#ffffff1f',
    color: '#fff',
    minWidth: '50px', // Minimum width for small screens
    maxWidth: 'fit-content', // Maximum width to prevent overflow
    flex: '1 1 auto', // Allows flexible sizing for wrapping
    margin: '0', // Adds spacing around each tab
    transition: 'background-color 0.4s, transform 0.4s, opacity 0.4s, border-color 0.4s',
    ':hover': {
      background: '#ffffff40'
    },
    '&.Mui-selected': {
      color: '#fff',
      background: variant === 'neutral'
        ? '#07d'
        : `${Helper.getSecondaryColor(variant === 'sell' ? -1 : 1, useConfigStore.getState().colorScheme)}`
    }
  })
);

