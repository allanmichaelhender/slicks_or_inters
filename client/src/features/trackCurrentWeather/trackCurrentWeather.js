import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import {
//   addFavoriteRecipe,
//   removeFavoriteRecipe,
// } from "../favoriteRecipes/favoriteRecipesSlice";
// import { selectSearchTerm } from "../search/searchSlice";

export const loadWeather = createAsyncThunk(
  "allRecipes/getAllRecipes",
  async () => {
    const data = await fetch("api/recipes?limit=10");
    const json = await data.json();
    return json;
  }
);

const sliceOptions = {
  name: "allRecipes",
  initialState: {
    recipes: [],
    isLoading: false,
    hasError: false,
  },
  reducers: {},
  extraReducers: {
    [loadRecipes.pending]: (state, action) => {
      // fill out function body
      state.isLoading = true;
      state.hasError = false;
    },
    [loadRecipes.fulfilled]: (state, action) => {
      // fill out function body
      state.isLoading = false;
      state.hasError = false;
      state.recipes = action.payload;
    },
    [loadRecipes.rejected]: (state, action) => {
      // fill out function body
      state.isLoading = false;
      state.hasError = true;
    },
  },
};

export const allRecipesSlice = createSlice(sliceOptions);

export const selectAllRecipes = (state) => state.allRecipes.recipes;

export const selectFilteredAllRecipes = (state) => {
  const allRecipes = selectAllRecipes(state);
  const searchTerm = selectSearchTerm(state);

  return allRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export default allRecipesSlice.reducer;
