import { createSlice } from "@reduxjs/toolkit";

const weatherMapSlice = createSlice({
    name: weatherMapSlice,
    initialState: {
        weatherMapToggle: false,
        weatherMapTrack: "Australian Grand Prix"
    },
    reducers: {
        toggleMap: (state, action) => {
            state.weatherMapToggle ? state.weatherMapToggle = false : state.weatherMapToggle = true
        },
        changeTrack: (state, action) => state.weatherMapTrack = action.trackName,
    }
})

export const { toggleMap, changeTrack } = weatherMapSlice.actions;

export default weatherMapSlice.reducer;