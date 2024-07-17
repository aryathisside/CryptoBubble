import { Box, Stack, Typography } from '@mui/material';
import { KeyboardArrowDown, Reorder, SettingsSuggest, Workspaces } from '@mui/icons-material';
import { useState } from 'react';
import StyledButton from '../ui/overrides/Button';
import { StyledIconTab, StyledIconTabs } from '../ui/overrides/IconTabs';

const FooterTabs = () => {
  const [value, setValue] = useState(0);
  return (
    <Box pb={1 / 2}>
      <Stack direction="row" justifyContent="space-between">
        <Box ml={1}>
          <StyledButton>
            <Stack direction="row" gap={1}>
              <Typography color="white" fontWeight="bold">
                1-100
              </Typography>
              <KeyboardArrowDown />
            </Stack>
          </StyledButton>
        </Box>

        <Box mr={1}>
          <StyledIconTabs value={value} onChange={(e, val) => setValue(val)} sx={{ flexGrow: '1' }}>
            <StyledIconTab icon={<Workspaces />} />
            <StyledIconTab icon={<Reorder />} />
            <StyledIconTab icon={<SettingsSuggest />} />
          </StyledIconTabs>
        </Box>
      </Stack>
    </Box>
  );
};

export default FooterTabs;
