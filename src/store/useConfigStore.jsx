import { create } from 'zustand';

const useConfigStore = create((set) => ({
  configuration: {
    id: '1',
    name: 'min1',
    color: 'performance',
    content: 'performance',
    size: 'performance',
    period: 'min1',
    currency: {
      id: 'usd',
      symbol: '$',
      code: 'USD'
    },
    colorScheme: 'red-green'
  },
  setConfig: (config) => set((state) => ({ configuration: { ...state.configuration, ...config } })),
  layout: 'bubble',
  setLayout: (layout) => set((state) => ({ ...state, layout }))
}));

export default useConfigStore;
