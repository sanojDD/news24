import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const REELS_API = `${BASE_URL}/api/reels`;

// 1. The "Fetch" Thunk: Gets all videos from MongoDB
export const fetchReels = createAsyncThunk("reels/fetchReels", async () => {
  const response = await axios.get(REELS_API);
  return response.data;
});

// 2. The "Post" Thunk
export const postNewReel = createAsyncThunk(
  "reels/postNewReel",
  async (reelData) => {
    const response = await axios.post(REELS_API, reelData);
    return response.data;
  },
);

// 3. The "Like" Thunk (FIXED: Removed localhost)
export const likeReel = createAsyncThunk(
  "reels/likeReel",
  async ({ id, username }) => {
    const response = await axios.put(
      `${REELS_API}/${id}/like`, // Correctly uses the dynamic URL
      { username },
    );
    return response.data;
  },
);

const initialState = {
  reels: [],
  status: "idle",
  error: null,
};

export const reelsSlice = createSlice({
  name: "reels",
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const reel = state.reels.find(
        (r) => r.id === action.payload || r._id === action.payload,
      );
      if (reel) {
        reel.isLiked = !reel.isLiked;
        reel.likes += reel.isLiked ? 1 : -1;
      }
    },
    // Keep for local UI testing if needed, but postNewReel is preferred now
    addReel: (state, action) => {
      state.reels.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reels Cases
      .addCase(fetchReels.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reels = action.payload;
      })
      .addCase(fetchReels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Post Reel Case: When the DB save is successful, add it to our list
      .addCase(postNewReel.fulfilled, (state, action) => {
        state.reels.unshift(action.payload);
      })
      .addCase(likeReel.fulfilled, (state, action) => {
        // Find the reel in our current state and update its likes from the DB response
        const index = state.reels.findIndex(
          (r) => r._id === action.payload._id,
        );
        if (index !== -1) {
          state.reels[index] = action.payload;
        }
      });
  },
});

export const { toggleLike, addReel } = reelsSlice.actions;
export default reelsSlice.reducer;
