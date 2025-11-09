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
      query: ({ id }: { id: string}) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "GET"
      }),
    })
  })
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
} = productApiSlice;