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
    weather: [], 
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadWeather.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(loadWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.weather = action.payload;
      })
      .addCase(loadWeather.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const selectAllWeather = (state) => state.allWeather.weather;

export default allWeatherSlice.reducer;
