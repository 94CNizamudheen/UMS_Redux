

export interface User {
    _id:string;
    username:string;
    email:string;
    role:'user'|'admin';
    profileImage:string;
    createdAt:string;
    updatedAt:string
}
export interface AuthState{
    user:User|null;
    token:string|null;
    isAuthenticated:boolean;
    isLoading: boolean;
    error:string|null
}
export interface UserState{
    users:User[];
    selectedUser:User|null;
    isLoading:boolean;
    error:string|null;
}