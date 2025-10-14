import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/products", productRoutes);

export default routes;