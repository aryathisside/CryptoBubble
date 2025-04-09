import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Constant from '../utils/Constant';

const useConfigStore = create(
  persist(
    (set) => ({
      configuration: Constant.DEFAULT_CONFIGS[0],
      currency: {
        id: 'usd',
        symbol: '$',
        code: 'USD'
      },
      allConfigs: Constant.DEFAULT_CONFIGS,
      updateAllConfigs: (allConfigs) => set(() => ({ allConfigs })),
      colorScheme: 'red-green',
      setColorScheme: (colorScheme) =>
        set(() => ({
          colorScheme
        })),
      setConfig: (config) => set((state) => ({ configuration: { ...state.configuration, ...config } })),
      editConfig: false,
      setEditConfig: (editConfig) => set(() => ({ editConfig })),
      layout: 'bubble',
      setLayout: (layout) => set(() => ({ layout })),
      watchlists: [{ id: 1, name: '', symbols: [] }],
      updateAllWatchlist: (watchlists) => set(() => ({ watchlists: [...watchlists] })),
      blocklist: [],
      updateBlocklist: (blocklist) => set(() => ({ blocklist: [...blocklist] })),
      favorites: [],
      updateFavorites: (favorites) => set(() => ({ favorites: [...favorites] })),
      setInitConfig: (config) => {
        set(() => ({ ...config }));
      },
      initializeWishlist: async () => {
        try {
          const userEmail = localStorage.getItem('userEmail'); // Assuming email is stored in localStorage
          if (!userEmail) {
            console.error('User not logged in');
            return;
          }

          const response = await fetch(`${process.env.GET_WISHLIST}?email=${userEmail}`);
          if (response.ok) {
            const data = await response.json();

            const favorites = data.watchlists.find((watchlist) => watchlist.name === 'favorites')?.symbols || [];
            const blocklist = data.watchlists.find((watchlist) => watchlist.name === 'blocklist')?.symbols || [];
            const watchlists = data.watchlists.filter((watchlist) => watchlist.name !== 'favorites' && watchlist.name !== 'blocklist') || [];
            console.log("watchlist is", watchlists)


            set({
              favorites,
              blocklist,
              watchlists, // Exclude blocklist and favorites from here if they are already handled separately
            });
            console.log('Wishlist initialized from backend');
          } else {
            console.error('Failed to fetch wishlist data from backend');
          }
        } catch (error) {
          console.error('Error initializing wishlist:', error);
        }
      }


    }),
    {
      name: 'config'
    }
  )
);

export default useConfigStore;
