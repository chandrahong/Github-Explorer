import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
    name: "filter",
    initialState: {
        selectedFilter: null,
        selectedRepo : null,
        paramsRepo : null,
    },
    reducers:{
        select_filter: (state, action) => {
            state.selectedFilter = action.payload;
        },
        select_repo: (state, action) => {
            state.selectedRepo = action.payload;
        },
        select_params_repo : (state, action) => {
            state.paramsRepo = action.payload;
        },
    }
});

export const {select_filter, select_repo, select_params_repo} = filterSlice.actions;
export const selectFilter = (state) => state.filter.selectedFilter;
export const selectRepo = (state) => state.filter.selectedRepo;
export const selectparamsRepo = (state) => state.filter.paramsRepo;

export default filterSlice.reducer;