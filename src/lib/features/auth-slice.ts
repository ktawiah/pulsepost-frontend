import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  isAuthenticated: boolean;
  authType: "reset" | "register" | "login";
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
}

const initialState: InitialState = {
  isAuthenticated: false,
  authType: "login",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    authenticateUser: (state, action: PayloadAction<InitialState["user"]>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { authenticateUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
