import { Order } from "../../generated/prisma";

export type Orders = {
  data: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
