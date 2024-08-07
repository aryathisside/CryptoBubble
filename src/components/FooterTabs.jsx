import { Box, Stack, Typography } from '@mui/material';
import { KeyboardArrowDown, Reorder, SettingsSuggest, Workspaces } from '@mui/icons-material';
import { useState } from 'react';
import StyledButton from '../ui/overrides/Button';
import { StyledIconTab, StyledIconTabs } from '../ui/overrides/IconTabs';
import useConfigStore from '../store/useConfigStore';

const FooterTabs = () => {
  const [value, setValue] = useState(0);
  const layout = useConfigStore((state) => state.layout);
  const setLayout = useConfigStore((state) => state.setLayout);

  return (
    <Box pb={1 / 2}>
      <Stack direction="row" justifyContent="space-between">
        <Box ml={1}>
          <StyledButton>
            <Stack direction="row" gap={1}>
              <Typography color="white" fontWeight="bold">
                1-100
              </Typography>
             {/* <KeyboardArrowDown />*/}
            </Stack>
          </StyledButton>
        </Box>

        <Box mr={1}>
          <StyledIconTabs value={layout} onChange={(e, val) => setLayout(val)} sx={{ flexGrow: '1' }}>
            <StyledIconTab value="bubble" icon={<Workspaces />} />
            <StyledIconTab value="list" icon={<Reorder />} />
            <StyledIconTab value="settings" icon={<SettingsSuggest />} />
          </StyledIconTabs>
        </Box>
      </Stack>
    </Box>
  );
};

export default FooterTabs;
