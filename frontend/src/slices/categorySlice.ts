import { apiSlice } from "./apiSlice";
const CATEGORY_URL = "/api/v1/categories";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: `${CATEGORY_URL}`,
        method: "GET"
      }),
    }),
    getCategory: builder.query({
      query: ({ id }: { id: string}) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "GET"
      }),
    })
  })
})

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
} = categoryApiSlice;