import { createSlice,createAsyncThunk,PayloadAction, } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState,User } from "../../Types";


const initialState:AuthState={
    user:null,
    token:localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading:false,
    error:null
};

export const login=createAsyncThunk(
    'auth/login',
    async(credentials:{email:string,passWord:string},{rejectWithValue})=>{
        try {
            const response=await axios.post('/api/auth/login',credentials);
            localStorage.setItem('token',response.data.token);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data?.message || 'Registration failed');
            }
            return rejectWithValue('An unknown error occurred');
          }
    }
);

export const register=createAsyncThunk(
    'auth/register',
    async(userData:{username:string;email:string,passWord:string},{rejectWithValue})=>{
        try {
            const response= await axios.post('/api/auth/register',userData);
            localStorage.setItem('token',response.data.token);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data?.message);
            }
            return rejectWithValue('Registration failed');
        }
    }
);

export const loadUser= createAsyncThunk(
    'auth/loadUser',
    async(_,{rejectWithValue,getState})=>{
        try {
            const state = getState() as { auth: AuthState };
            const config={
                headers:{
                    Authorization:`Bearer ${state.auth.token}`
                },
            };
            const response= await axios.get('api/auth/me',config);
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data?.message);
            }
            return rejectWithValue('Failed to load user');
        }
    }
);
const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        logout:(state)=>{
            localStorage.removeItem('token');
            state.user=null;
            state.token=null;
            state.isAuthenticated=false;
            state.error=null;
        },
        clearError:(state)=>{
            state.error=null;
        }
    },
    extraReducers:(builder)=>{
        builder 
        .addCase(login.pending,(state)=>{
            state.isLoading=true;
            state.error=null;
        })
        .addCase(login.fulfilled,(state,action:PayloadAction<{user:User;token:string}>)=>{
            state.isLoading=false;
            state.isAuthenticated=true;
            state.token=action.payload.token;
            state.user=action.payload.user;
        })
        .addCase(register.rejected,(state,action)=>{
            state.isLoading=false;
            state.error = action.payload as string;
        })
        .addCase(loadUser.pending,(state)=>{
            state.isLoading=true;
            state.error=null;
        })
        .addCase(loadUser.fulfilled,(state,action:PayloadAction<User>)=>{
            state.isLoading=false;
            state.isAuthenticated=true;
            state.user=action.payload;
        })
        .addCase(loadUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.error= action.payload as string;
            state.isAuthenticated=false;
            state.user=null;
        })
        
    }


})

export const {logout,clearError}=authSlice.actions;
export default authSlice.reducer;