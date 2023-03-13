
import {configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import filterReducer from './reducers/filterSlice'
import issueReducer from './reducers/issueSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        filter : filterReducer,
        issue : issueReducer,
    }
});

export default store;