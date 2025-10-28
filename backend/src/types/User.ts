import { User } from "../../generated/prisma";

export type Users = {
  data: Omit<User, "password">[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type PasswordResult = {
  message: string;
};
