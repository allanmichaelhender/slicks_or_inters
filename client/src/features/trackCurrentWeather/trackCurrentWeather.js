import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const loadWeather = createAsyncThunk(
  "trackCurrentWeather/loadWeather",
  async (arg, thunkAPI) => {
    const response = await api.get("app/loadWeather", {
      params: {
        latitude: arg.latitude,
        longitude: arg.longitude,
      },
    });
    return response.data;
  }
);

export const allWeatherSlice = createSlice({
  name: "allWeather",
  initialState: {
    weather: [], // Ensure this matches the property you update below
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  // The Builder Callback is the required standard in 2025
  extraReducers: (builder) => {
    builder
      .addCase(loadWeather.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loadWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.weather = action.payload; // Fixed: Changed 'recipes' to 'weather'
      })
      .addCase(loadWeather.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

// Selector: Accesses the state.weather array defined in initialState
export const selectAllWeather = (state) => state.allWeather.weather;

// Export the reducer (Fixed: used the correct slice name)
export default allWeatherSlice.reducer;
