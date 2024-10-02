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
      }
    }),
    {
      name: 'config'
    }
  )
);

export default useConfigStore;
