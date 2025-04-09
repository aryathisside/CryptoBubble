import { Box, ClickAwayListener, Grow, Typography } from '@mui/material';
import { Add, Block, Check, RemoveRedEye, Star } from '@mui/icons-material';
import { useState } from 'react';
import StyledIconButton from '../../ui/overrides/IconButton';
import useConfigStore from '../../store/useConfigStore';

const WishlistAdd = ({ symbol }) => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const watchlists = useConfigStore((state) => state.watchlists);
  const updateAllWatchlist = useConfigStore((state) => state.updateAllWatchlist);
  const favorites = useConfigStore((state) => state.favorites);
  const updateFavorites = useConfigStore((state) => state.updateFavorites);
  const blocklist = useConfigStore((state) => state.blocklist);
  const updateBlocklist = useConfigStore((state) => state.updateBlocklist);


  const getUserEmail = () => {
    return localStorage.getItem('userEmail'); // Assuming the email is stored in localStorage
  };
  
  const sendWishlistUpdateToBackend = async (wishlistType, symbolId, id) => {
    const userEmail = getUserEmail();
    
    if (!userEmail) {
      console.error('User not logged in');
      return;
    }
  
    const requestData = {
      email: userEmail,
      wishlistName: wishlistType,  // 'favorites', 'blocklist', 'watchlist'
      symbolId: symbolId,
      id
      
    };
  
    try {
      const response = await fetch(process.env.WISHLIST_UPDATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        console.log('Wishlist updated successfully');
      } else {
        console.error('Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error while sending wishlist update:', error);
    }
  };

  const deleteWishlistFromBackend = async (wishlistType, symbolId) => {
    const userEmail = getUserEmail();
  
    if (!userEmail) {
      console.error('User not logged in');
      return;
    }
  
    const requestData = {
      email: userEmail,
      wishlistName: wishlistType,
      symbolId: symbolId
    };
  
    try {
      const response = await fetch(process.env.WISHLIST_DELETE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        console.log('Wishlist item deleted successfully');
      } else {
        console.error('Failed to delete item from wishlist');
      }
    } catch (error) {
      console.error('Error while deleting item from wishlist:', error);
    }
  };
  

  const toggleFav = () => {
    let newFav = favorites;
    if (newFav.includes(symbol.id)) {
      newFav = newFav.filter((item) => item !== symbol.id);
      deleteWishlistFromBackend('favorites', symbol.id)
    } else {
      newFav.push(symbol.id);
      sendWishlistUpdateToBackend('favorites', symbol.id);  // Send to backend
    }
    updateFavorites(newFav);
   
  };

  const toggleBlocklist = () => {
    let newBlock = blocklist;
    if (newBlock.includes(symbol.id)) {
      newBlock = newBlock.filter((item) => item !== symbol.id);
      deleteWishlistFromBackend('blocklist', symbol.id)
    } else {
      newBlock.push(symbol.id);
      sendWishlistUpdateToBackend('blocklist', symbol.id); 
    }
    updateBlocklist(newBlock);
    
    
  };

  const toggleWatchlist = (id) => {
    const findIndex = watchlists.findIndex((item) => item.id === id);
    let wl = watchlists[findIndex].symbols;
    const watchlistName = watchlists[findIndex].name || `Watchlist ${findIndex + 1}`;
    if (wl.includes(symbol.id)) {
      wl = wl.filter((item) => item !== symbol.id);
      deleteWishlistFromBackend(watchlistName, symbol.id)
      
    } else {
      wl.push(symbol.id);
      sendWishlistUpdateToBackend(watchlistName, symbol.id,id)
    }
    watchlists[findIndex].symbols = wl;
    console.log(watchlists)
    updateAllWatchlist(watchlists);
    
  };

  const isWatchlist = () => {
    let isWatchlistBool = false;
    watchlists.forEach((item) => {
      if (item.symbols.includes(symbol.id)) {
        isWatchlistBool = true;
      }
    });
    return isWatchlistBool;
  };

  const selectedIcon = (selected) => {
    return selected ? <Check sx={{ color: '#09f', ml: 1 }} /> : <Add sx={{ color: '#ccc', ml: 1 }} />;
  };
  return (
    <ClickAwayListener onClickAway={() => setIsWishlistOpen(false)}>
      <Box>
        <StyledIconButton onClick={() => setIsWishlistOpen(!isWishlistOpen)} sx={{ mr: 2, background: isWishlistOpen ? '#0375D9 !important' : null }}>
          <Add />
          {favorites.includes(symbol.id) && <Star sx={{ position: 'absolute', fontSize: '0.7em', top: -3, left: -5 }} />}
          {blocklist.includes(symbol.id) && <Block sx={{ position: 'absolute', fontSize: '0.7em', top: -3, right: -5 }} />}
          {isWatchlist() && <RemoveRedEye sx={{ position: 'absolute', fontSize: '0.7em', bottom: -3, right: -5 }} />}
        </StyledIconButton>
        <Box position="relative">
          <Grow in={isWishlistOpen}>
            <Box
              position="absolute"
              sx={{
                display: isWishlistOpen ? 'block' : 'none',
                background: '#444444e6',
                backdropFilter: 'blur(8px)',
                boxShadow: '0px 2px 11px 7px #00000027',
                left: 0,
                zIndex: 100,
                borderRadius: 2,
                overflow: 'hidden',
                mt: 1
              }}>
              <Box>
                <Box
                  display="flex"
                  alignItems="center"
                  px={1}
                  py={1}
                  onClick={() => toggleFav()}
                  justifyContent="space-between"
                  sx={{
                    color: favorites.includes(symbol.id) ? '#09F' : 'white',
                    cursor: 'pointer',
                    ':hover': { background: '#ffffff1f' },
                    borderBottom: 'solid rgba(255,255,255,.12) 1px'
                  }}>
                  <Box display="flex" alignItems="center">
                    <Star sx={{ mr: 1 / 2 }} />
                    <Typography fontSize="1em" color="inherit">
                      Favorites
                    </Typography>
                  </Box>
                  {selectedIcon(favorites.includes(symbol.id))}
                </Box>

                {watchlists.map((item, index) => {
                  return (
                    <Box
                      key={item.id}
                      display="flex"
                      alignItems="center"
                      px={1}
                      py={1}
                      onClick={() => toggleWatchlist(item.id)}
                      justifyContent="space-between"
                      sx={{
                        color: item.symbols.includes(symbol.id) ? '#09F' : 'white',
                        cursor: 'pointer',
                        ':hover': { background: '#ffffff1f' },
                        borderBottom: 'solid rgba(255,255,255,.12) 1px'
                      }}>
                      <Box display="flex" alignItems="center">
                        <RemoveRedEye sx={{ mr: 1 / 2 }} />
                        <Typography fontSize="1em" color="inherit" noWrap>
                          {item.name || `Watchlist ${index + 1}`}
                        </Typography>
                      </Box>
                      {selectedIcon(item.symbols.includes(symbol.id))}
                    </Box>
                  );
                })}

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  px={1}
                  py={1}
                  onClick={() => toggleBlocklist()}
                  sx={{
                    color: blocklist.includes(symbol.id) ? '#09F' : 'white',
                    cursor: 'pointer',
                    ':hover': { background: '#ffffff1f' }
                  }}>
                  <Box display="flex" alignItems="center">
                    <Block sx={{ mr: 1 / 2 }} />
                    <Typography fontSize="1em" color="inherit">
                      Blocklist
                    </Typography>
                  </Box>
                  {selectedIcon(blocklist.includes(symbol.id))}
                </Box>
              </Box>
            </Box>
          </Grow>
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default WishlistAdd;
