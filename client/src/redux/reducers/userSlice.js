import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        repo: null,
        token: null,
    },
    reducers: {
        set_user : (state, action) => {
            state.user = action.payload;
        },
        set_repo : (state, action) => {
            state.repo = action.payload;
        },
    }
});

export const {set_user, set_repo} = userSlice.actions;
export const SelectUser = (state) => state.user.user;
export const SelectRepo = (state) => state.user.repo;

export default userSlice.reducer;