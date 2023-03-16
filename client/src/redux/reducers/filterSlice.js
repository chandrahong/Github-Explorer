import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
    name: "filter",
    initialState: {
        selectedFilter: null,
        selectedRepo : null,
        paramsRepo : null,
        parameter : null,
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
        select_parameters_url : (state, action) => {
            state.parameter = action.payload;
        }
    }
});

export const {select_filter, select_repo, select_params_repo, select_parameters_url} = filterSlice.actions;
export const selectFilter = (state) => state.filter.selectedFilter;
export const selectRepo = (state) => state.filter.selectedRepo;
export const selectparamsRepo = (state) => state.filter.paramsRepo;
export const selectparamaterUrl = (state) => state.filter.parameter

export default filterSlice.reducer;