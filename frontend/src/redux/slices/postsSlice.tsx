import { createSlice, current } from '@reduxjs/toolkit';

import { PostByAccount } from 'utils/getPostByAccount';

interface InitialState {
  posts: PostByAccount[];
}

const initialState: InitialState = {
  posts: [],
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    setAllPosts: (state, action) => {
      state.posts.splice(0, current(state).posts.length);
      state.posts.push(...action.payload);
    },
    removePost: (state, action) => {
      const filteredArray = state.posts.filter((post) => post.author !== action.payload);
      state.posts = filteredArray;
    },
  },
});

export const { addPost, removePost, setAllPosts } = postsSlice.actions;
export default postsSlice.reducer;
