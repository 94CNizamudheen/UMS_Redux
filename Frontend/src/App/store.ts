import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../Features/Auth/authSlice';
import userReducer from '../Features/Users/userSlice';



export const store=configureStore({
    reducer:{
        auth:authReducer,
        users:userReducer,
    }
});


export type RootState= ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;


