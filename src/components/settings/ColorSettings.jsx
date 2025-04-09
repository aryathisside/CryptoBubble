import { Box, Grow, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { KeyboardArrowDown } from '@mui/icons-material';
import StyledButton from '../../ui/overrides/Button';
import useConfigStore from '../../store/useConfigStore';
import RadioIcon from '../../assets/icons/RadioIcon';
import RadioIconSelected from '../../assets/icons/RadioIconSelected'

const ColorSettings = () => {
  const colorScheme = useConfigStore((state) => state.colorScheme);
  const setColorScheme = useConfigStore((state) => state.setColorScheme);

  const [isOpen, setIsOpen] = useState(false);
  const updateColorScheme = (color) => {
    setColorScheme(color);
    setIsOpen(false);
  };
  return (
    <Box position="relative" ml={1}>
      <StyledButton onClick={() => setIsOpen(!isOpen)} sx={{ background: isOpen ? '#0676DB !important' : null }}>
        <Stack direction="row" gap={1}>
          <Typography color="white" fontWeight="bold" textTransform="none">
            {colorScheme === 'red-green' ? 'Red + Green' : 'Yellow + Blue'}
          </Typography>
          <KeyboardArrowDown
            sx={{
              transition: 'transform 0.4s',
              transform: isOpen ? 'rotateZ(180deg)' : ''
            }}
          />
        </Stack>
      </StyledButton>
      <Grow in={isOpen}>
        <Box
          position="absolute"
          sx={{
            display: isOpen ? 'block' : 'none',
            background: '#444444e6',
            backdropFilter: 'blur(8px)',
            // width: 200,
            maxWidth: '90vw',
            top: 55,
            borderRadius: 3,
            boxShadow: '0px 0px 7px 7px #00000027',
            zIndex: 2,
            right: 0,
            overflow: 'hidden'
          }}>
          <Stack>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => updateColorScheme('red-green')}
              sx={{
                cursor: 'pointer',
                px: 2,
                transition: 'background .4s',
                ':hover': { background: '#ffffff14' },
                borderBottom: '1px solid #656565'
              }}>
              <Box display="flex" alignItems="center" color={colorScheme === 'red-green' ? '#09f' : 'white'}>
                {colorScheme === 'red-green' ? <RadioIconSelected /> : <RadioIcon />}
                <Typography noWrap fontWeight="bold" color="inherit" ml={1} px={1} py={1}>
                  Red + Green
                </Typography>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => updateColorScheme('yellow-blue')}
              sx={{
                cursor: 'pointer',
                px: 2,
                transition: 'background .4s',
                ':hover': { background: '#ffffff14' }
              }}>
              <Box display="flex" alignItems="center" color={colorScheme === 'yellow-blue' ? '#09f' : 'white'}>
                {colorScheme === 'yellow-blue' ? <RadioIconSelected /> : <RadioIcon />}
                <Typography noWrap fontWeight="bold" color="inherit" ml={1} px={1} py={1}>
                  Yellow + Blue
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Grow>
    </Box>
  );
};

export default ColorSettings;
