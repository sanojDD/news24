// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import reelsReducer from "../features/reels/reelsSlice";

export const store = configureStore({
  reducer: {
    reels: reelsReducer,
  },
});
