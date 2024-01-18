import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface WalletState {
  isWalletConnected: boolean;
}

const initialState: WalletState = {
  isWalletConnected: false,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    walletConnect: (state, action: PayloadAction<boolean>) => {
      state.isWalletConnected = action.payload;
    },
  },
});

export const { walletConnect } = walletSlice.actions;
export const selectIsConnected = (state: RootState) =>
  state.wallet.isWalletConnected;

export default walletSlice.reducer;
