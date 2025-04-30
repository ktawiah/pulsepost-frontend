import api from "./api";
import { Post } from "@/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const postsUrl = `${backendUrl}/posts`;

interface GetPostsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
}

interface UpdatePostParams {
  id: string;
  data: Partial<Post>;
}

export const postsEndpoints = api.injectEndpoints({
  endpoints: (build: any) => ({
    getPosts: build.query({
      query: ({ page = 1, pageSize = 10, search, tag }: GetPostsParams) => ({
        url: `${postsUrl}/`,
        method: "GET",
        params: {
          page,
          page_size: pageSize,
          search,
          tag,
        },
      }),
    }),
    getRecentPosts: build.query({
      query: ({ page = 1, pageSize = 10 }: GetPostsParams) => ({
        url: `${postsUrl}/recent/`,
        method: "GET",
        params: {
          page,
          page_size: pageSize,
        },
      }),
    }),
    getMyPosts: build.query({
      query: ({ page = 1, pageSize = 10 }: GetPostsParams) => ({
        url: `${postsUrl}/my/`,
        method: "GET",
        params: {
          page,
          page_size: pageSize,
        },
      }),
    }),
    getPost: build.query({
      query: (id: string) => ({
        url: `${postsUrl}/${id}/`,
        method: "GET",
      }),
    }),
    createPost: build.mutation({
      query: (data: Partial<Post>) => ({
        url: `${postsUrl}/`,
        method: "POST",
        body: data,
      }),
    }),
    updatePost: build.mutation({
      query: ({ id, data }: UpdatePostParams) => ({
        url: `${postsUrl}/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    deletePost: build.mutation({
      query: (id: string) => ({
        url: `${postsUrl}/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetRecentPostsQuery,
  useGetMyPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsEndpoints;
