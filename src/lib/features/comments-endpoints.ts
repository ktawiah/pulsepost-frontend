import api from "./api";
import { Comment } from "@/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const commentsUrl = `${backendUrl}/comments`;

interface GetCommentsParams {
  page?: number;
  pageSize?: number;
  post?: string;
}

interface UpdateCommentParams {
  id: string;
  data: Partial<Comment>;
}

export const commentsEndpoints = api.injectEndpoints({
  endpoints: (build: any) => ({
    getComments: build.query({
      query: ({ page = 1, pageSize = 10, post }: GetCommentsParams) => ({
        url: `${commentsUrl}/`,
        method: "GET",
        params: {
          page,
          page_size: pageSize,
          post,
        },
      }),
    }),
    getComment: build.query({
      query: (id: string) => ({
        url: `${commentsUrl}/${id}/`,
        method: "GET",
      }),
    }),
    getCommentReplies: build.query({
      query: (id: string) => ({
        url: `${commentsUrl}/${id}/replies/`,
        method: "GET",
      }),
    }),
    createComment: build.mutation({
      query: (data: Partial<Comment>) => ({
        url: `${commentsUrl}/`,
        method: "POST",
        body: data,
      }),
    }),
    updateComment: build.mutation({
      query: ({ id, data }: UpdateCommentParams) => ({
        url: `${commentsUrl}/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteComment: build.mutation({
      query: (id: string) => ({
        url: `${commentsUrl}/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetCommentQuery,
  useGetCommentRepliesQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsEndpoints; 