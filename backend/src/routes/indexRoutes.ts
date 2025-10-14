import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import categoryRoutes from "./categoryRoutes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/products", productRoutes);
routes.use("/categories", categoryRoutes);

export default routes;
