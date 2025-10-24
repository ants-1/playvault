import { prisma } from "../lib/prisma";
import { calculateOrderAmount } from "../utils/calculateOrderAmount";

// amount should equal: all orderDetail product (price * quanity)

export const getOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
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

    return orders;
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    throw new Error("Failed to fetch orders.");
  }
};

export const getOrdersByCustomer = async (customerId: number) => {
  try {
    const orders = await prisma.order.findMany({
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

    return orders;
  } catch (error: any) {
    console.error("Failed to fetch orders by customer:", error);
    throw new Error("Failed to fetch order by customer.");
  }
};

export const getOrderById = async (id: number) => {
  try {
    const order = await prisma.order.findUnique({
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
    const amount = calculateOrderAmount(orderDetails) | 0;

    const newOrder = await prisma.order.create({
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
    console.error("Failed to create order:", error);
    throw new Error("Failed to create order.");
  }
};

export const updateOrder = async (
  id: number,
  orderStatus?: string,
  shippingAddress?: string,
  orderAddress?: string
) => {
  try {
    const updatedOrder = await prisma.order.update({
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
    console.error("Failed to update order:", error);
    throw new Error("Failed to update order.");
  }
};

export const deleteOrder = async (id: number) => {
  try {
    const deletedOrder = await prisma.order.delete({
      where: { id },
    });

    return deletedOrder;
  } catch (error: any) {
    console.error("Failed to delete order:", error);
    throw new Error("Failed to delete order.");
  }
};

export const addProductsToOrder = async (
  orderId: number,
  products: { productId: number; price: number; quantity: number }[]
) => {
  try {
    const updatedOrder = await prisma.order.update({
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
    console.error("Failed to add products to order:", error);
    throw new Error("Failed to add products to order.");
  }
};

export const updateOrderProduct = async (
  orderDetailId: number,
  updates: { price?: number; quantity?: number }
) => {
  try {
    const updatedOrderDetails = await prisma.orderDetail.update({
      where: { id: orderDetailId },
      data: updates,
      include: { product: true, order: true },
    });

    return updatedOrderDetails;
  } catch (error: any) {
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

    if (deletedOrderDetails.count === 0) {
      throw new Error("No matching product found in this order.");
    }

    return deletedOrderDetails;
  } catch (error: any) {
    console.error("Failed to delete product from order:", error);
    throw new Error("Failed to delete product from order.");
  }
};
