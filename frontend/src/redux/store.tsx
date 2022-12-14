import { combineReducers, configureStore } from '@reduxjs/toolkit';

import welcomePopupReducer from './slices/welcomePopupSlice';
import walletAccountsReducer from './slices/walletAccountsSlice';
import postsReducer from './slices/postsSlice';

const rootReducer = combineReducers({
  welcomePopup: welcomePopupReducer,
  walletAccounts: walletAccountsReducer,
  posts: postsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
