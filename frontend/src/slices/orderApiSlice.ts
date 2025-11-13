import { apiSlice } from "./apiSlice";
const ORDER_URL = "/api/v1/orders";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ userId, page = 1, limit = 10 }) => ({
        url: `${ORDER_URL}/customers/${userId}?page=${page}&limit=${limit}`,
        method: "GET",
        providesTags: ["Orders"],
      }),
    }),
    getOrder: builder.query({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}`,
        method: "GET",
        providesTags: ["Orders"],
      }),
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: `${ORDER_URL}`,
        method: "POST",
        body: orderData,
        invalidatesTags: ["Orders"],
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ orderId, orderData }) => ({
        url: `${ORDER_URL}/${orderId}`,
        method: "PUT",
        body: orderData,
        invalidatesTags: ["Orders"],
      }),
    }),
    addProductToOrder: builder.mutation({
      query: ({ orderId, product }) => ({
        url: `${ORDER_URL}/${orderId}/products`,
        method: "POST",
        body: product,
        invalidatesTags: ["Orders"],
      }),
    }),
    updateOrderProduct: builder.mutation({
      query: ({ orderId, updates }) => ({
        url: `${ORDER_URL}/products/${orderId}`,
        method: "PUT",
        body: updates,
        invalidatesTags: ["Orders"],
      }),
    }),
    removeOrderProduct: builder.mutation({
      query: ({ orderId, productId }) => ({
        url: `${ORDER_URL}/${orderId}/products/${productId}`,
        method: "DELETE",
        invalidatesTags: ["Orders"],
      }),
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useAddProductToOrderMutation,
  useUpdateOrderProductMutation,
  useRemoveOrderProductMutation,
  useDeleteOrderMutation,
} = orderApiSlice;
