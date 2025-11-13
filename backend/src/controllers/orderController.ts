import { Request, Response } from "express";
import * as orderService from "../services/orderService";
import { Orders } from "../types/Order";
import { Order, OrderDetail } from "../../generated/prisma";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    if (page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive." });
    }

    const orders: Orders = await orderService.getOrders(page, limit);

    if (!orders) {
      res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    if (!id) {
      res.status(404).json({ error: "Order ID not found." });
    }

    const order: Order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const getOrdersByCustomer = async (req: Request, res: Response) => {
  try {
    const customerId: number = parseInt(req.params.customerId);
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    if (!customerId) {
      res.status(404).json({ error: "Customer ID not found." });
    }

    if (page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive." });
    }

    const orders: Orders = await orderService.getOrdersByCustomer(
      customerId,
      page,
      limit
    );

    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      shippingAddress,
      orderAddress,
      orderEmail,
      orderStatus,
      orderDetails,
    } = req.body;

    const newOrder: Order = await orderService.createOrder(
      customerId,
      shippingAddress,
      orderAddress,
      orderEmail,
      orderStatus,
      orderDetails
    );

    if (!newOrder) {
      return res.status(500).json({ error: "Failed to create order." });
    }

    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const { orderStatus, shippingAddress, orderAddress } = req.body;

    const updatedOrder: Order = await orderService.updateOrderDetails(
      id,
      orderStatus,
      shippingAddress,
      orderAddress
    );

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const deletedOrder = await orderService.deleteOrder(id);
    res
      .status(200)
      .json({ message: "Order deleted successfully", deletedOrder });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const addProductsToOrder = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.orderId);
    const product = req.body;

    const updatedOrder = await orderService.addProductToOrder(orderId, product);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateOrderProduct = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.orderDetailId);
    const updates = req.body;

    const updatedOrder = await orderService.updateOrderProducts(
      orderId,
      updates
    );
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteOrderProduct = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.orderId);
    const productId: number = parseInt(req.params.productId);

    const deletedDetail = await orderService.deleteOrderProduct(
      orderId,
      productId
    );

    res.status(200).json({
      message: "Product removed from order",
      deletedDetail,
    });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteAllOrderProducts = async (req: Request, res: Response) => {
  try {
    const orderId: number = parseInt(req.params.orderId);

    const deletedDetails = await orderService.deleteAllOrderProducts(orderId);

    res.status(200).json({
      message: "All products removed from order",
      deletedDetails,
    });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};
