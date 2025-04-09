import { create } from 'zustand';
import useConfigStore from './useConfigStore';
import axios from 'axios';

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
   logout: async() => {
    try {
      
      const res = await axios.get(process.env.LOGOUT)
      console.log(res.data)
      console.log("logout successfully...")
      
    } catch (error) {
      console.log(error.message)
      
    }
    localStorage.removeItem("config")
     localStorage.removeItem('token');
     localStorage.removeItem('userEmail');
     set({ isAuthenticated: false });
     useConfigStore.getState().updateAllWatchlist([]); // Reset watchlists to an empty array
    //  window.location.href = '/';
   },
   // Add isMobile state
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
}));

export default useDataStore;
