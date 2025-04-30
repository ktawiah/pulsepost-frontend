import { Like, Post } from "@/types";
import { ThunkDispatch, } from "@reduxjs/toolkit";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import api from "./api";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const likesUrl = `${backendUrl}/likes`;

interface GetLikesParams {
  page?: number;
  pageSize?: number;
  post?: string;
}

type EndpointDefinitions = {
  getPost: {
    Query: string;
    Response: Post;
  };
};

type ApiEndpointQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>;

interface MutationLifecycleApi {
  dispatch: ThunkDispatch<any, any, any>;
  queryFulfilled: Promise<any>;
}

interface DeleteLikeParams {
  likeId: string;
  postId: string;
}

export const likesEndpoints = api.injectEndpoints({
  endpoints: (build: any) => ({
    getLikes: build.query({
      query: ({ page = 1, pageSize = 10, post }: GetLikesParams) => ({
        url: `${likesUrl}/`,
        method: "GET",
        params: {
          page,
          page_size: pageSize,
          post,
        },
      }),
    }),
    getLike: build.query({
      query: (id: string) => ({
        url: `${likesUrl}/${id}/`,
        method: "GET",
      }),
    }),
    createLike: build.mutation({
      query: (data: Partial<Like>) => ({
        url: `${likesUrl}/`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(
        { post: postId }: { post: string },
        { dispatch, queryFulfilled }: MutationLifecycleApi
      ) {
        const patchResult = dispatch(
          (api.util.updateQueryData as any)('getPost', postId, (draft: Post) => {
            draft.likes_count += 1;
            draft.is_liked = true;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteLike: build.mutation({
      query: ({ likeId }: DeleteLikeParams) => ({
        url: `${likesUrl}/${likeId}/`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { likeId, postId }: DeleteLikeParams,
        { dispatch, queryFulfilled }: MutationLifecycleApi
      ) {
        const patchResult = dispatch(
          (api.util.updateQueryData as any)('getPost', postId, (draft: Post) => {
            draft.likes_count -= 1;
            draft.is_liked = false;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetLikesQuery,
  useGetLikeQuery,
  useCreateLikeMutation,
  useDeleteLikeMutation,
} = likesEndpoints; 