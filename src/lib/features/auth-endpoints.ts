import api from "./api";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const accountsUrl = `${backendUrl}/auth`;
export const authEndpoints = api.injectEndpoints({
  endpoints: (build) => ({
    registerAccount: build.mutation<
      User,
      Pick<User, "email" | "first_name" | "last_name"> & Pass
    >({
      query: (data) => ({
        url: `${accountsUrl}/register/`,
        method: "POST",
        body: {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
          re_password: data.re_password,
        },
      }),
    }),
    loginAccount: build.mutation<
      User,
      Pick<User, "email"> & Pick<Pass, "password">
    >({
      query: (data) => ({
        url: `${accountsUrl}/login/`,
        method: "POST",
        body: {
          email: data.email,
          password: data.password,
        },
      }),
    }),
    verifyAccount: build.mutation<Pick<User, "refresh">, Pick<User, "access">>({
      query: (data) => ({
        url: `${accountsUrl}/verify/`,
        method: "POST",
        body: {
          token: data.access,
        },
      }),
    }),
    logoutAccount: build.mutation({
      query: () => ({
        url: `${accountsUrl}/logout/`,
        method: "POST",
      }),
    }),
    refreshAccount: build.mutation<
      Pick<User, "refresh" | "access">,
      Pick<User, "refresh">
    >({
      query: (data) => ({
        url: `${accountsUrl}/refresh/`,
        method: "POST",
        data: {
          refresh: data.refresh,
        },
      }),
    }),
    retrieveAccount: build.query<User, Pick<User, "id">>({
      query: (args) => ({
        url: `${accountsUrl}/users/${args.id}`,
        method: "GET",
      }),
    }),
    retrieveCurrentUser: build.query<User, null>({
      query: () => ({
        url: `${accountsUrl}/users/me`,
        method: "GET",
      }),
    }),
    requestPasswordResetEmail: build.mutation<null, Pick<User, "email">>({
      query: (data) => ({
        url: `${accountsUrl}/reset-password/`,
        method: "POST",
        body: {
          email: data.email,
        },
      }),
    }),
    resetPassword: build.mutation<null, ResetNewPass>({
      query: (data) => ({
        url: `${accountsUrl}/reset-password-confirm/`,
        method: "POST",
        body: {
          new_password: data.new_password,
          re_new_password: data.re_new_password,
          token: data.token,
          uid: data.uid,
        },
      }),
    }),

    socialAccountLogin: build.mutation<
      Pick<SocialAuthType, "token">,
      Pick<SocialAuthType, "state" | "code" | "provider">
    >({
      query: (data) => ({
        url: `${backendUrl}/auth/oauth/${
          data.provider
        }/?state=${encodeURIComponent(data.state)}&code=${encodeURIComponent(
          data.code
        )}`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),
  }),
});

export const {
  useLoginAccountMutation,
  useLogoutAccountMutation,
  useRefreshAccountMutation,
  useRegisterAccountMutation,
  useVerifyAccountMutation,
  useSocialAccountLoginMutation,
  useRequestPasswordResetEmailMutation,
  useResetPasswordMutation,
  useRetrieveAccountQuery,
  useRetrieveCurrentUserQuery,
} = authEndpoints;
