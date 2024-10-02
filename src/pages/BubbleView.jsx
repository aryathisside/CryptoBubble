import { Box, Stack } from '@mui/material';
import HeaderTabs from '../components/HeaderTabs';
import BubblePlot from '../components/BubblePlot';
import FooterTabs from '../components/FooterTabs';
import ChartView from '../components/symbol-detail/ChartView';
import useConfigStore from '../store/useConfigStore';
import ListView from '../components/list-layout/ListView';
import SettingsView from '../components/settings/SettingsView';

const BubbleView = () => {
  const layout = useConfigStore((state) => state.layout);
  return (
    <Stack sx={{ p: 0, bgcolor: '#222222', height: '100%' }}>
      <HeaderTabs />
      {layout === 'bubble' && <BubblePlot />}
      {layout === 'list' && <ListView />}
      {layout === 'settings' && <SettingsView />}
      <ChartView />
      <FooterTabs />
    </Stack>
  );
};

export default BubbleView;
