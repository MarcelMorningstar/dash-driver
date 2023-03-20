import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  active: false,
  available: false
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setActive: (state, action) => {
      state.active = action.payload;
    },
    setAvailable: (state, action) => {
      state.available = action.payload;
    },
  }
})

export const { setOrigin, setActive, setAvailable } = mainSlice.actions

export const selectOrigin = (state) => state.main.origin
export const selectActive = (state) => state.main.active
export const selectAvailable = (state) => state.main.available

export default mainSlice.reducer
