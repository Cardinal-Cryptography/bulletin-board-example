import { createSlice } from '@reduxjs/toolkit';

interface InitialState {
  isWelcomePopupVisible: boolean;
}

const initialState: InitialState = {
  isWelcomePopupVisible: true,
};

export const welcomePopupSlice = createSlice({
  name: 'welcomePopup',
  initialState,
  reducers: {
    showPopup: (state) => {
      state.isWelcomePopupVisible = true;
    },
    hidePopup: (state) => {
      state.isWelcomePopupVisible = false;
    },
  },
});

export const { showPopup, hidePopup } = welcomePopupSlice.actions;
export default welcomePopupSlice.reducer;
