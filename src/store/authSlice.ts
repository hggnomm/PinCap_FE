import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { decodedToken } from "../utils/utils";

interface IAuth {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isAuthenticated: boolean,
}
const tokenInfo: any =  decodedToken(localStorage.getItem('token')); 
// const tokenInfo: any =  decodedToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgxL2FwaS9hdXRoL2xvZ2luIiwiaWF0IjoxNzEzMDAxODE0LCJleHAiOjE3MTM2MDY2MTQsIm5iZiI6MTcxMzAwMTgxNCwianRpIjoiWW1RMllDUEgwdXk1QThzbSIsInN1YiI6IjViMWYyMjUxLTcwNWEtNDAyZC05ZmNkLTdhY2VkZmY2YTE3YSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJlbWFpbCI6ImxlZHV5dGFuMTc3MjAwM0BnbWFpbC5jb20iLCJuYW1lIjoiTGUgVGFuIiwicm9sZSI6IkFETUlOIiwiaWQiOiI1YjFmMjI1MS03MDVhLTQwMmQtOWZjZC03YWNlZGZmNmExN2EifQ.2PMC3Afjh3dpB01a7AuBpIyyGj557djwGTAPXQmB13Y"); 

const initialState: IAuth = {
  id: tokenInfo?.id || "",
  name: tokenInfo?.name || "",
  email: tokenInfo?.email || "",
  role: tokenInfo?.role || "",
  isAuthenticated: false,

};

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    
  }
)
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addToken: (state, action) => {
      const tokenInfo: any =  decodedToken(localStorage.getItem('token')); 
      state.id = tokenInfo?.id;
      state.email = tokenInfo?.email;
      state.name = tokenInfo?.name;
      state.role = tokenInfo?.role;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.id = "";
      state.email = "";
      state.name = "";
      state.role = "";
      state.isAuthenticated = false;
    },
  },
});

export const { addToken, logout } = authSlice.actions;
export const authorized = (state: RootState) => state.auth.email !== "";
export default authSlice.reducer;