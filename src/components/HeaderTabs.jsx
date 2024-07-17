/* eslint-disable prettier/prettier */
import { Box, Stack } from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import { StyledTab, StyledTabs } from '../ui/overrides/Tabs';
import StyledIconButton from '../ui/overrides/IconButton';
import HeaderProgress from './HeaderProgress';
import useConfigStore from '../store/useConfigStore';
import useDataStore from '../store/useDataStore';
import Helper from '../utils/Helper';

const HeaderTabs = () => {
  const config = useConfigStore((state) => state);
  const updateConfig = useConfigStore((state) => state.setConfig);
  const currencies = useDataStore((state) => state.currencies);

  const calculateVarient = (period) => {
    const weight = Helper.calculateConfigurationWeight({ ...config, period }, currencies);
    if (weight > 0) {
      return 'green';
    }
    if (weight < 0) {
      return 'red';
    }
    return 'neutral';
  };

  return (
    <Stack direction="row">
      <HeaderProgress />
      <StyledTabs variant="scrollable" value={config.period} onChange={(e, val) => updateConfig({ period: val })} sx={{ flexGrow: '1' }}>
        <StyledTab variant={calculateVarient('min1')} label="1min" value="min1" />
        <StyledTab variant={calculateVarient('min5')} label="5min" value="min5" />
        <StyledTab variant={calculateVarient('min15')} label="15min" value="min15" />
        <StyledTab variant={calculateVarient('day')} label="Day" value="day" />
        <StyledTab variant={calculateVarient('week')} label="Week" value="week" />
        {/* <StyledTab variant="green" label="Market Cap & Week" />
        <StyledTab variant="red" label="Market Cap & Month" /> */}
      </StyledTabs>
      <Box p={1}>
        <StyledIconButton>
          <Edit />
        </StyledIconButton>
      </Box>
      <Box p={1}>
        <StyledIconButton>
          <Add />
        </StyledIconButton>
      </Box>
    </Stack>
  );
};

export default HeaderTabs;
