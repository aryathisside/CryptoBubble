import { create } from 'zustand';

const useConfigStore = create((set) => ({
  id: '1',
  name: 'min1',
  color: 'performance',
  content: 'performance',
  size: 'performance',
  period: 'min1',

  setConfig: (config) => set({ ...config })
}));

export default useConfigStore;
