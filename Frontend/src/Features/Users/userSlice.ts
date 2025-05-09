/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios";
import { User, UserState } from '../../Types'
import { updateUser as updateAuthUser } from '../Auth/authSlice';


const initialState: UserState = {
    users: [],
    selectedUser: null,
    isLoading: false,
    error: null
}

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state: any = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${state.auth.token}`
                }
            }
            const response = await axios.get('http://localhost:8888/api/users', config);
            console.log(response)
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch")
        }
    }
);

export const fetchUserbyId = createAsyncThunk(
    'users/fetchUserbyId',
    async (userId: string, { rejectWithValue, getState, dispatch }) => {
        try {
            const state: any = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${state.auth.token}`
                }
            };
            const response = await axios.get(`http://localhost:8888/api/users/${userId}`, config);
            const stateAuth = getState() as { auth: { user: User | null } };
            if (stateAuth.auth.user?._id === userId) {
                dispatch(updateAuthUser(response.data.data));
            }
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "failed to fetch user")
        }
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData: Partial<User>, { rejectWithValue, getState }) => {
        try {
            const state: any = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${state.auth.token}`
                }
            }
            const response = await axios.post('http://localhost:8888/api/users', userData, config);
            return response.data.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create user')
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ userId, userData }: { userId: string; userData: Partial<User> }, { rejectWithValue, getState,dispatch }) => {
        try {
            const state: any = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${state.auth.token}`
                }
            };
            const response = await axios.put(`http://localhost:8888/api/users/${userId}`, userData, config);
            console.log("response data after update ", response.data.data)

            const stateAuth = getState() as { auth: { user: User | null } };
            if (stateAuth.auth.user?._id === userId) {
                dispatch(updateAuthUser(response.data.data));
            }
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Failed to update User");
        }
    }
);
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async ({ userId }: { userId: string }, { rejectWithValue, getState }) => {
        try {
            const state: any = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${state.auth.token}`
                }
            };
             await axios.delete(`http://localhost:8888/api/users/${userId}`, config);
            return { _id: userId };
        } catch (error: any) {
            return rejectWithValue(error?.data?.message || "Failed to delete User")
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setSelectedUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //create
            .addCase(fetchUserbyId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserbyId.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.users.unshift(action.payload)
            })
            .addCase(fetchUserbyId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string
            })
            //update
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.selectedUser?._id === action.payload._id) {
                    state.selectedUser = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            //delete
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<{ _id: string }>) => {
    state.isLoading = false;
    state.users = state.users.filter(user => user._id !== action.payload._id);
    if (state.selectedUser?._id === action.payload._id) {
        state.selectedUser = null;
    }
})

            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    }
})

export const { setSelectedUser, clearError, } = usersSlice.actions;
export default usersSlice.reducer;