import { apiSlice } from "./apiSlice";
const PRODUCT_URL = "/api/v1/products";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}?limit=1000`,
        method: "GET"
      }),
    }),
    getProduct: builder.query({
      query: (id: string) => `${PRODUCT_URL}/${id}`,
    }),
  })
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
} = productApiSlice;