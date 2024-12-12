import { create } from 'zustand';

const useDataStore = create((set) => ({
  currencies: [],
  selectedCurrency: null,
  setCurrencies: (currencies) => set({ currencies }),
  setSelectedCurrency: (selectedCurrency) => set({ selectedCurrency }),
  loading: true,
  setLoading: (value) => set({ loading: value }),
  filter: { type: 'all', id: null },
  updateFilter: (filter) => set({ filter }),
   // New authentication state
   isAuthenticated: !!localStorage.getItem('token'), // Initialize from localStorage
   setAuthenticated: (status) => set({ isAuthenticated: status }),
   logout: () => {
    localStorage.removeItem("config")
     localStorage.removeItem('token');
     localStorage.removeItem('userEmail');
     set({ isAuthenticated: false });
    //  window.location.href = '/';
   },
}));

export default useDataStore;
