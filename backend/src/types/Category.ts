import { Category } from "../../generated/prisma";

export type Categories = {
  data: Category[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
