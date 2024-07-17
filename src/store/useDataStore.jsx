import { create } from 'zustand';

const useDataStore = create((set) => ({
  currencies: [],
  setCurrencies: (currencies) => set({ currencies })
}));

export default useDataStore;
