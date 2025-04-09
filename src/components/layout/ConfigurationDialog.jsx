import { Box, Dialog, DialogContent, DialogTitle, Slide, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Close, Delete, Edit, KeyboardArrowDown } from '@mui/icons-material';
import StyledIconButton from '../../ui/overrides/IconButton';
import useConfigStore from '../../store/useConfigStore';
import StyledTextField from '../../ui/overrides/TextField';
import StyledButton from '../../ui/overrides/Button';
import Constant from '../../utils/Constant';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const ConfigurationDialog = () => {
  const allConfigs = useConfigStore((state) => state.allConfigs);
  const updateAllConfig = useConfigStore((state) => state.updateAllConfigs);
  const config = useConfigStore((state) => state.configuration);
  const setConfig = useConfigStore((state) => state.setConfig);
  const editConfig = useConfigStore((state) => state.editConfig);
  const setEditConfig = useConfigStore((state) => state.setEditConfig);

  const [expanded, setExpanded] = useState(true);

  const updatePeriod = (period) => {
    setConfig({ period });
    const index = allConfigs.findIndex((item) => item.id === config.id);
    allConfigs[index].period = period;
    updateAllConfig(allConfigs);
  };

  const updateSize = (size) => {
    setConfig({ size });
    const index = allConfigs.findIndex((item) => item.id === config.id);
    allConfigs[index].size = size;
    updateAllConfig(allConfigs);
  };

  const updateContent = (content) => {
    setConfig({ content });
    const index = allConfigs.findIndex((item) => item.id === config.id);
    allConfigs[index].content = content;
    updateAllConfig(allConfigs);
  };

  const updateColor = (color) => {
    setConfig({ color });
    const index = allConfigs.findIndex((item) => item.id === config.id);
    allConfigs[index].color = color;
    updateAllConfig(allConfigs);
  };

  const updateName = (name) => {
    setConfig({ name });
    const index = allConfigs.findIndex((item) => item.id === config.id);
    allConfigs[index].name = name;
    updateAllConfig(allConfigs);
  };

  const handleDeleteConfig = () => {
    const newAllConfigs = allConfigs.filter((item) => item.id !== config.id);
    updateAllConfig(newAllConfigs);
    setConfig(newAllConfigs[0]);
    setEditConfig(false);
  };

  return (
    <Dialog
      fullWidth
      open={editConfig}
      hideBackdrop
      maxWidth="sm"
      scroll="paper"
      TransitionComponent={Transition}
      
      sx={{ '& .MuiDialog-container': { alignItems: 'start' } }}
      PaperProps={{
        sx: { background: '#171A24',paddingX:2, backdropFilter: 'blur(8px)', marginTop: 'min(10%, 100px)', marginX: 2, width: 'calc(100% - 32px)' }
      }}>
      <>
        <DialogTitle typography="body1" display="flex" alignItems="center" justifyContent="space-between" color="white" sx={{ padding: 1 }}>
          <Box display="flex" alignItems="center" flex="1">
            <StyledIconButton onClick={() => setExpanded(!expanded)} sx={{ mr: 2 }}>
              <KeyboardArrowDown sx={{ transition: 'all 0.2s', transform: expanded ? '' : 'rotateZ(-90deg)' }} />
            </StyledIconButton>
            <StyledTextField
            sx={{backgroundColor:"#00000033"}}
              value={config.name}
              onChange={(e) => updateName(e.target.value)}
              fullWidth
              placeholder={Constant.renderLabel(config)}
              InputProps={{ startAdornment: <Edit /> }}
              
            />
          </Box>
          <Box>
            {allConfigs.length > 1 && (
              <StyledIconButton
                sx={{ ml: 1 }}
                onClick={() => {
                  handleDeleteConfig();
                }}>
                <Delete />
              </StyledIconButton>
            )}
            <StyledIconButton
              sx={{ ml: 1 }}
              onClick={() => {
                setEditConfig(false);
              }}>
              <Close />
            </StyledIconButton>
          </Box>
        </DialogTitle>
        {expanded && (
          <DialogContent sx={{ padding: 1 }}>
            <Stack>
              <Typography typography="h6" color="#ccc">
                Period
              </Typography>
              <Box>
                {Constant.PERIODS.map((item) => (
                  <StyledButton
                    onClick={() => updatePeriod(item.value)}
                    key={item.value}
                    sx={{ mr: 1, mb: 1, px: 2, background: config.period === item.value ? '#0477DD !important' : null }}>
                    <Typography color="white" textTransform="none">
                      {item.label}
                    </Typography>
                  </StyledButton>
                ))}
              </Box>

              <Typography typography="h6" color="#ccc">
                Bubble Size
              </Typography>
              <Box>
                {Constant.SIZE.map((item) => (
                  <StyledButton
                    onClick={() => updateSize(item.value)}
                    key={item.value}
                    sx={{ mr: 1, mb: 1, px: 2, background: config.size === item.value ? '#0477DD !important' : null }}>
                    <Typography color="white" textTransform="none">
                      {item.label}
                    </Typography>
                  </StyledButton>
                ))}
              </Box>

              <Typography typography="h6" color="#ccc">
                Bubble Content
              </Typography>
              <Box>
                {Constant.CONTENT.map((item) => (
                  <StyledButton
                    onClick={() => updateContent(item.value)}
                    key={item.value}
                    sx={{ mr: 1, mb: 1, px: 2, background: config.content === item.value ? '#0477DD !important' : null }}>
                    <Typography color="white" textTransform="none">
                      {item.label}
                    </Typography>
                  </StyledButton>
                ))}
              </Box>

              <Typography typography="h6" color="#ccc">
                Bubble Color
              </Typography>
              <Box>
                {Constant.COLOR.map((item) => (
                  <StyledButton
                    onClick={() => updateColor(item.value)}
                    key={item.value}
                    sx={{ mr: 1, mb: 1, px: 2, background: config.color === item.value ? '#0477DD !important' : null  }}>
                    <Typography color="white" textTransform="none">
                      {item.label}
                    </Typography>
                  </StyledButton>
                ))}
              </Box>
            </Stack>
          </DialogContent>
        )}
      </>
    </Dialog>
  );
};

export default ConfigurationDialog;
