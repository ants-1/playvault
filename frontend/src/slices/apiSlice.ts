import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./apiConfig";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"],
  endpoints: (_builder) => ({}),
});