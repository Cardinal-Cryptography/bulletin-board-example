import { createSlice } from '@reduxjs/toolkit';

import { PostByAccount } from 'utils/getPostByAccount';

interface InitialState {
  posts: PostByAccount[];
}

const initialState: InitialState = {
  posts: [],
};

export const welcomePopupSlice = createSlice({
  name: 'welcomePopup',
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    setAllPosts: (state, action) => {
      state.posts = action.payload;
    },
    removePost: (state, action) => {
      const filteredArray = state.posts.filter((post) => post.author !== action.payload);
      state.posts = filteredArray;
    },
  },
});

export const { addPost, removePost, setAllPosts } = welcomePopupSlice.actions;
export default welcomePopupSlice.reducer;
