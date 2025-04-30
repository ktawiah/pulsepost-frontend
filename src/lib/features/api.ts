import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { authenticateUser, logoutUser } from "./auth-slice";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  credentials: "include",
  baseUrl: backendUrl,
  prepareHeaders: (headers, { getState }) => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    
    if (csrfToken) {
      headers.set('X-CSRFToken', csrfToken);
    }
    return headers;
  },
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: `${backendUrl}/auth/refresh/`,
            method: "POST",
          },
          api,
          extraOptions
        ) as { data: { id: string; email: string; first_name: string; last_name: string } };
        if (refreshResult.data) {
          api.dispatch(authenticateUser(refreshResult.data));
          result = await baseQuery(args, api, extraOptions);
        } else {
          await baseQuery(
            {
              url: `${backendUrl}/auth/logout/`,
              method: "POST",
            },
            api,
            extraOptions
          );
          api.dispatch(logoutUser());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({}),
});

export default api;
