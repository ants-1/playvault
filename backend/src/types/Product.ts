import { Product } from "../../generated/prisma";

export type Products = {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
