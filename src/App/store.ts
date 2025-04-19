import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../Features/Auth/authSlice';
import userReducer from '../Features/Auth/authSlice';



export const store=configureStore({
    reducer:{
        auth:authReducer,
        user:userReducer,
    }
});


export type RootState= ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;


