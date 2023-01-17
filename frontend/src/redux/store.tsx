import { combineReducers, configureStore } from '@reduxjs/toolkit';

import welcomePopupReducer from './slices/welcomePopupSlice';
import walletAccountsReducer from './slices/walletAccountsSlice';
import postsReducer from './slices/postsSlice';
import { loadState, saveState } from './localStorage';

const rootReducer = combineReducers({
  welcomePopup: welcomePopupReducer,
  walletAccounts: walletAccountsReducer,
  posts: postsReducer,
});

const persistedState = loadState();

const store = configureStore({
  preloadedState: persistedState,
  reducer: rootReducer,
});

const STORAGE_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours

store.subscribe(() => {
  saveState({ walletAccounts: store.getState().walletAccounts }, STORAGE_EXPIRATION_TIME);
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
