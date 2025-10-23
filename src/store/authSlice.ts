import { createSlice } from "@reduxjs/toolkit";

import { TokenPayload } from "@/types/Auth";

import { decodedToken } from "../utils/utils";

import { RootState } from "./store";

interface IAuth {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isAuthenticated: boolean,
}
const tokenInfo: TokenPayload | null = decodedToken(localStorage.getItem('token')); 

const initialState: IAuth = {
  id: tokenInfo?.id || "",
  name: tokenInfo?.name || "",
  email: tokenInfo?.mail || "",
  role: tokenInfo?.role || "",
  isAuthenticated: false,

};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addToken: (state, _action) => {
      const tokenInfo: TokenPayload | null = decodedToken(localStorage.getItem('token')); 
      state.id = tokenInfo?.id || "";
      state.email = tokenInfo?.mail || "";
      state.name = tokenInfo?.name || "";
      state.role = tokenInfo?.role || "";
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