import api from "./api";
import { Tag } from "@/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const tagsUrl = `${backendUrl}/tags`;

interface GetTagsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

interface UpdateTagParams {
  id: string;
  data: Partial<Tag>;
}

export const tagsEndpoints = api.injectEndpoints({
  endpoints: (build: any) => ({
    getTags: build.query({
      query: ({ page = 1, pageSize = 10, search }: GetTagsParams) => ({
        url: `${tagsUrl}/`,
        method: "GET",
        params: {
          page,
          page_size: pageSize,
          search,
        },
      }),
    }),
    getTag: build.query({
      query: (id: string) => ({
        url: `${tagsUrl}/${id}/`,
        method: "GET",
      }),
    }),
    createTag: build.mutation({
      query: (data: Partial<Tag>) => ({
        url: `${tagsUrl}/`,
        method: "POST",
        body: data,
      }),
    }),
    updateTag: build.mutation({
      query: ({ id, data }: UpdateTagParams) => ({
        url: `${tagsUrl}/${id}/`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteTag: build.mutation({
      query: (id: string) => ({
        url: `${tagsUrl}/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetTagQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagsEndpoints; 