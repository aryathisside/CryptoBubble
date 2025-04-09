import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../Utils/init-supabase";

const initialState = {
  data: {
    coinId: "USD",
    coinName: "Virtual USD",
    amount: 0
  },
  status: "idle"
};

export const fetchAvailableCoins = createAsyncThunk(
  "availableCoins/fetchAvailableCoin",
  async (id) => {
    // get available coins
    let { data: availableUsdCoin, error } = await supabase
      .from("portfolio")
      .select("coinId,coinName,amount")
      .eq("userId", `${id}`)
      .eq("coinId", "USD");

    if (error) {
      throw new Error("Something went wrong");
    }

    return availableUsdCoin[0];
  }
);

const availableCoinsSlice = createSlice({
  name: "availableCoins",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableCoins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAvailableCoins.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(fetchAvailableCoins.rejected, (state) => {
        state.status = "failed";
      });
  }
});

export default availableCoinsSlice.reducer;
