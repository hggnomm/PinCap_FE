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

const initialState: IAuth = {
  id: tokenInfo?.id || "",
  name: tokenInfo?.name || "",
  email: tokenInfo?.email || "",
  role: tokenInfo?.role || "",
  isAuthenticated: false,

};

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