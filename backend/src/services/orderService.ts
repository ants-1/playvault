import { Order, OrderDetail } from "../../generated/prisma";
import { prisma } from "../lib/prisma";
import { calculateOrderAmount } from "../utils/calculateOrderAmount";

export const getOrders = async (page: number = 1, limit: number = 10) => {
  try {
    const skip: number = (page - 1) * limit;

    const orders: Order[] = await prisma.order.findMany({
      skip,
      take: limit,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        details: {
          include: { product: true },
        },
      },
      orderBy: { orderDate: "desc" },
    });

    const total: number = await prisma.order.count();
    const totalPages: number = Math.ceil(total / limit);

    return {
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    throw new Error("Failed to fetch orders.");
  }
};

export const getOrdersByCustomer = async (
  customerId: number,
  page: number = 1,
  limit: number
) => {
  try {
    const skip: number = (page - 1) * limit;

    const orders: Order[] = await prisma.order.findMany({
      skip,
      take: limit,
      where: { customerId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        details: {
          include: { product: true },
        },
      },
      orderBy: { orderDate: "desc" },
    });

    const total: number = await prisma.order.count();
    const totalPages: number = Math.ceil(total / limit);

    return {
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch orders by customer:", error);
    throw new Error("Failed to fetch order by customer.");
  }
};

export const getOrderById = async (id: number) => {
  try {
    const order: Order = await prisma.order.findUniqueOrThrow({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        details: {
          include: { product: true },
        },
      },
    });

    return order;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Order not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to fetch orders by ID:", error);
    throw new Error("Failed to fetch order by ID.");
  }
};

export const createOrder = async (
  customerId: number,
  shippingAddress: string,
  orderAddress: string,
  orderEmail: string,
  orderStatus: string,
  orderDetails: { productId: number; price: number; quantity: number }[]
) => {
  try {
    const amount: number = calculateOrderAmount(orderDetails) | 0;

    const newOrder: Order = await prisma.order.create({
      data: {
        customerId,
        amount,
        shippingAddress,
        orderAddress,
        orderEmail,
        orderStatus,
        details: {
          create: orderDetails,
        },
      },
      include: {
        details: {
          include: { product: true },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return newOrder;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Order not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to create order:", error);
    throw new Error("Failed to create order.");
  }
};

export const updateOrderDetails = async (
  id: number,
  orderStatus?: string,
  shippingAddress?: string,
  orderAddress?: string
) => {
  try {
    const updatedOrder: Order = await prisma.order.update({
      where: { id },
      data: {
        orderStatus,
        shippingAddress,
        orderAddress,
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        details: { include: { product: true } },
      },
    });
    return updatedOrder;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Order not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to update order:", error);
    throw new Error("Failed to update order.");
  }
};

export const deleteOrder = async (id: number) => {
  try {
    const deletedOrder: Order = await prisma.order.delete({
      where: { id },
    });

    return deletedOrder;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Order not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to delete order:", error);
    throw new Error("Failed to delete order.");
  }
};

export const addProductsToOrder = async (
  orderId: number,
  products: { productId: number; price: number; quantity: number }[]
) => {
  try {
    const updatedOrder: Order = await prisma.order.update({
      where: { id: orderId },
      data: {
        details: {
          create: products,
        },
      },
      include: {
        details: { include: { product: true } },
      },
    });

    return updatedOrder;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Order not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to add products to order:", error);
    throw new Error("Failed to add products to order.");
  }
};

export const updateOrderProduct = async (
  orderDetailId: number,
  updates: { price?: number; quantity?: number }
) => {
  try {
    const updatedOrderDetails: OrderDetail = await prisma.orderDetail.update({
      where: { id: orderDetailId },
      data: updates,
      include: { product: true, order: true },
    });

    return updatedOrderDetails;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Order not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to update order product:", error);
    throw new Error("Failed to update order product.");
  }
};

export const deleteOrderProduct = async (
  orderId: number,
  productId: number
) => {
  try {
    const deletedOrderDetails = await prisma.orderDetail.deleteMany({
      where: {
        orderId,
        productId,
      },
    });

    // Throw NotFoundError if no matching product found
    if (deletedOrderDetails.count === 0) {
      const error = new Error("No matching product found in this order.");
      error.name = "NotFoundError";
      throw error;
    }

    return deletedOrderDetails;
  } catch (error: any) {
    // Prisma record not found
    if (error.code === "P2025" || error.code === "P2021") {
      const notFoundError = new Error("Order not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    // Already a NotFoundError
    if (error.name === "NotFoundError") {
      throw error;
    }

    console.error("Failed to delete product from order:", error);
    throw new Error("Failed to delete product from order.");
  }
};

