import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { authEndpoints } from "./features/auth-endpoints";
import authReducer from "./features/auth-slice";
import customStorage from "./features/storage";

const authConfig = {
  key: "auth",
  storage: customStorage,
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authEndpoints.reducerPath]: authEndpoints.reducer,
      // @ts-expect-error
      auth: persistReducer(authConfig, authReducer),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(authEndpoints.middleware),
  });
};

export const store = makeStore();
export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
