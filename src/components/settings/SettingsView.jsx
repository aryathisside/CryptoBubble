import { Box, Stack, Typography } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import StyledIconButton from '../../ui/overrides/IconButton';
import useConfigStore from '../../store/useConfigStore';
import StyledTextField from '../../ui/overrides/TextField';
import Logo from '/image2.png';
import ColorSettings from './ColorSettings';

const SettingsView = () => {
  const watchlists = useConfigStore((state) => state.watchlists);
  const updateAllWatchlist = useConfigStore((state) => state.updateAllWatchlist);

  const updateName = (id, value) => {
    const index = watchlists.findIndex((item) => item.id === id);
    watchlists[index].name = value;
    updateAllWatchlist(watchlists);
  };

  const addWatchList = () => {
    const item = {
      id: Date.now(),
      name: '',
      symbols: []
    };
    watchlists.push(item);
    updateAllWatchlist(watchlists);
  };

  const removeWatchlist = (id) => {
    const wl = watchlists.filter((item) => item.id !== id);
    updateAllWatchlist(wl);
  };
  return (
    <Box sx={{ flexGrow: 1, width: '100%', px: 2, py: 3, overflow: 'scroll' }}>
      <Stack>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography typography="h6" color="white">
            Colors
          </Typography>
          <ColorSettings />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography typography="h6" color="white">
            Watchlists
          </Typography>
          <StyledIconButton>
            <Add onClick={() => addWatchList()} />
          </StyledIconButton>
        </Box>
        {watchlists.map((item, index) => {
          return (
            <Box display="flex" key={item.id} alignItems="center" my={1}>
              <StyledTextField
                fullWidth
                placeholder={`Watchlist ${index + 1}`}
                value={item.name}
                onChange={(e) => updateName(item.id, e.target.value)}
                InputProps={{ startAdornment: <Edit /> }}
              />
              <StyledIconButton onClick={() => removeWatchlist(item.id)} sx={{ ml: 1 }}>
                <Delete />
              </StyledIconButton>
            </Box>
          );
        })}
        <Box display="flex" justifyContent="center" mt={7} sx={{ opacity: 0.85 }}>
          <img src={Logo} alt="AI + Bubbles" width={300} style={{ maxWidth: '40vw' }} />
        </Box>
      </Stack>
    </Box>
  );
};

export default SettingsView;
