import { create } from 'zustand';

const useDataStore = create((set) => ({
  currencies: [],
  selectedCurrency: null,
  setCurrencies: (currencies) => set({ currencies }),
  setSelectedCurrency: (selectedCurrency) => set({ selectedCurrency }),
  loading: true,
  setLoading: (value) => set({ loading: value }),
  filter: { type: 'all', id: null },
  updateFilter: (filter) => set({ filter })
}));

export default useDataStore;
