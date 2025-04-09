import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Our Backend API
const baseUrl =process.env.SIMULATOR_API;

// ✅ CoinGecko API (only for /coins/:id and /ohlc)

export const coinsDataApi = createApi({
  reducerPath: "coinsData",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    // ✅ Fetch Coins Market Data from our backend
    getCoinsData: builder.query({
      query: ({ currency, page }) =>
        `/coins/markets`,
    }),

    // ✅ Fetch Trending Coins Data from our backend
    getTrendingCoinData: builder.query({
      queryFn: async () => {
        try {
          const res = await fetch(`${baseUrl}/trending`);

          if (!res.ok) {
            throw new Error("Something went wrong! Please try again");
          }

          const data = await res.json();
          return { data };
        } catch (error) {
          return { error: error };
        }
      },
    }),

    // ✅ Fetch Global Crypto Data from our backend
    getGlobalCryptoData: builder.query({
      queryFn: async () => {
        try {
          const res = await fetch(`${baseUrl}/global`);

          if (!res.ok) {
            throw new Error("Something went wrong! Please try again");
          }

          const data = await res.json();
          return { data };
        } catch (error) {
          return { error: error };
        }
      },
    }),

    // 🔴 **Keep CoinGecko APIs Unchanged**
    getCoinData: builder.query({
      query: (id) => `${baseUrl}/coins/${id}`,
    }),

    getHistoricalData: builder.query({
      query: (options) =>
        `${baseUrl}/coins/${options.id}/ohlc?vs_currency=usd&days=${options.chartDays}`,
    }),
  }),
});

export const {
  useGetCoinsDataQuery,
  useGetCoinDataQuery,
  useGetHistoricalDataQuery,
  useGetTrendingCoinDataQuery,
  useGetGlobalCryptoDataQuery,
} = coinsDataApi;

