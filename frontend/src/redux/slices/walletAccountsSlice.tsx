import { createSlice, current } from '@reduxjs/toolkit';

export declare type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum';

export interface InjectedAccountWithMeta {
  address: string;
  meta: {
    genesisHash: string | null;
    name: string | null;
    source: string | null;
  };
  type: KeypairType | null;
}

interface InitialState {
  account: InjectedAccountWithMeta | null;
  allAccounts: InjectedAccountWithMeta[];
}

const initialState: InitialState = {
  account: null,
  allAccounts: [],
};

export const walletAccountsSlice = createSlice({
  name: 'walletAccounts',
  initialState,
  reducers: {
    connectWallet: (state, action) => {
      state.account = current(state).allAccounts.includes(action.payload) ? action.payload : null;
    },
    disconnectWallet: (state) => {
      state.account = null;
    },
    updateAllAccounts: (state, action) => {
      state.allAccounts = action.payload;
      if (!action.payload.includes(current(state).account)) {
        state.account = null;
      }
    },
  },
});

export const { connectWallet, disconnectWallet, updateAllAccounts } = walletAccountsSlice.actions;
export default walletAccountsSlice.reducer;
