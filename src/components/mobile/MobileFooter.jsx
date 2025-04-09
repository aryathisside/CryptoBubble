import React, { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Box, Button, Typography, Slide } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SettingsIcon from '@mui/icons-material/Settings';
import { Dialog, DialogContent } from '@mui/material';
import StyledIconButton from '../../ui/overrides/IconButton';
import { Add, Edit, Reorder, SettingsSuggest, Workspaces } from '@mui/icons-material';
import useConfigStore from '../../store/useConfigStore';
import { StyledTab, StyledTabs } from '../../ui/overrides/Tabs';
import Helper from '../../utils/Helper';
import useDataStore from '../../store/useDataStore';
import Constant from '../../utils/Constant';
import { WrappedTab, WrappedTabsContainer } from '../../ui/overrides/WrappedTabs';
import SettingsView from '../settings/SettingsView';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const MobileFooter = () => {
 
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const setLayout = useConfigStore((state) => state.setLayout);
  const layout = useConfigStore((state) => state.layout);
  const updateConfig = useConfigStore((state) => state.setConfig);
  const allConfigs = useConfigStore((state) => state.allConfigs);
  const config = useConfigStore((state) => state.configuration);
  const currencies = useDataStore((state) => state.currencies);
  const setEditConfig = useConfigStore((state) => state.setEditConfig);
  const updateAllConfig = useConfigStore((state) => state.updateAllConfigs);
  const setConfig = useConfigStore((state) => state.setConfig);
  const [selectedTab, setSelectedTab] = useState(null);
 
  const [dialogView, setDialogView] = useState('period'); // State to track the view in the dialog


  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      setDialogView('period'); // Set dialog to show period selection
      setOpen(true); // Open the dialog
    } else if (newValue === 2) { // Assuming 2 is the index of the settings icon
      setDialogView('settings'); // Set dialog to show settings view
      setOpen(true); // Open the dialog
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const calculateVarient = (item) => {
    const weight = Helper.calculateConfigurationWeight(item, currencies);
    if (weight > 0) {
      return 'buy';
    }
    if (weight < 0) {
      return 'sell';
    }
    return 'neutral';
  };

  const handleAddConfig = () => {
    const item = { ...Constant.DEFAULT_CONFIGS[0] };
    console.log(item)
    item.period = 'min1';
    item.id = Date.now();
    allConfigs.push(item);
    updateAllConfig(allConfigs);
    setConfig(item);
    setEditConfig(true);
  };

   // Set the first item as selected on initial render
   useEffect(() => {
   setSelectedTab(config.id)
  }, [config]); // Ensure it runs when `allConfigs` is available

  return (
    <>
      {/* Dialog for Period Selection */}
       <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        sx={{
          '.MuiDialog-paper': {
            border: "none",
            position: 'fixed',
            bottom: 80,
            margin: 0,
            width: '100%',
            height: "fit-content",
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            display: "flex",
            bgcolor:"#171A24"
          }
        }}>
        <DialogContent sx={{ bgcolor: '#171A24' , px:2,py:1 }}>
          {dialogView === 'period' ? (
            <>
              <Typography variant='h5' mb={2} color={"white"}>
                Period
              </Typography>
              <WrappedTabsContainer>
              {allConfigs.map((item) => {
                const variant = calculateVarient(item)
                return <WrappedTab
                key={item.id}
                variant={calculateVarient(item)}
                label={item.name || Constant.renderLabel(item)}
                value={item.id}
                onClick={() => {
                  setSelectedTab(item.id); // Update selected tab
                  updateConfig(allConfigs.find((configItem) => item.id === configItem.id));
                }}
                style={{
                  background: selectedTab === item.id
                    ? (variant === 'neutral' ? '#07d' : `${Helper.getSecondaryColor(variant === 'sell' ? -1 : 1, useConfigStore.getState().colorScheme)}`)
                    : '', // Default background for unselected tabs
                }}
              />

              }
        
      )}
                <Box display={"flex"} gap={1} p={1}>
                  <StyledIconButton sx={{ height: "100%" }} onClick={() => setEditConfig(true)}>
                    <Edit />
                  </StyledIconButton>
                  <StyledIconButton sx={{ height: "100%" }} onClick={() => handleAddConfig()}>
                    <Add />
                  </StyledIconButton>
                </Box>
              </WrappedTabsContainer>
            </>
          ) : (
            // Render SettingView component if dialogView is 'settings'
            <SettingsView />
          )}
        </DialogContent>    
      </Dialog>

      {/* Footer Navigation */}
      <Paper sx={{ position: 'fixed',backgroundColor: '#171A24', bottom: 0, left: 0, right: 0, height: '80px', display: 'flex' }} elevation={3}>
        <BottomNavigation
          value={value}
          onChange={handleChange}
          sx={{ backgroundColor: '#171A24', width: '100%', height: '100%', padding: '10px' }}
          showLabels>
          <BottomNavigationAction sx={{ color: 'white' }} icon={<AccessTimeIcon />} />
          <Box bgcolor={'#2A2E36'} display={'flex'} justifyContent={'center'} alignItems={'center'} borderRadius={'32px'} p={1}>
            <BottomNavigationAction
              sx={{ bgcolor: layout === 'bubble' ? '#171A24' : 'none', width: '100%', height: '100%', borderRadius: '32px', color: 'white' }}
              onClick={() => setLayout('bubble')}
              icon={<Workspaces />}
            />
            <BottomNavigationAction
              sx={{ bgcolor: layout === 'list' ? '#171A24' : 'none', width: '100%', height: '100%', borderRadius: '32px', color: 'white' }}
              onClick={() => setLayout('list')}
              icon={<Reorder />}
            />
          </Box>
          <BottomNavigationAction sx={{ color: 'white' }}  icon={<SettingsSuggest />} />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default MobileFooter;
