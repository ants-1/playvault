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
  orderDetails: { productId: number; quantity: number }[]
) => {
  try {
    const detailsWithProduct = await Promise.all(
      orderDetails.map(async (d) => {
        const product = await prisma.product.findUniqueOrThrow({
          where: { id: d.productId },
        });
        return { ...d, price: product.price };
      })
    );

    const amount: number = calculateOrderAmount(detailsWithProduct);

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

// Add single product to order - if in order increase quantity
export const addProductToOrder = async (
  orderId: number,
  product: { productId: number; quantity: number }
) => {
  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { details: true },
    });

    const existingProduct = await prisma.orderDetail.findFirst({
      where: { orderId, productId: product.productId },
    });

    if (existingProduct) {
      await prisma.orderDetail.update({
        where: { id: existingProduct.id },
        data: { quantity: existingProduct.quantity + product.quantity },
      });
    } else {
      await prisma.orderDetail.create({
        data: {
          orderId,
          productId: product.productId,
          quantity: product.quantity,
        },
      });
    }

    const updatedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { details: { include: { product: true } } },
    });

    const amount = calculateOrderAmount(
      updatedOrder.details.map((d) => ({ ...d, price: d.product.price }))
    );

    return prisma.order.update({
      where: { id: orderId },
      data: { amount },
      include: { details: { include: { product: true } } },
    });
  } catch (error: any) {
    console.error("Failed to add product to order:", error);
    throw new Error("Failed to add product to order.");
  }
};

// Update multiple order products
export const updateOrderProducts = async (
  orderId: number,
  updates: { orderDetailId: number; quantity?: number }[]
) => {
  try {
    await prisma.order.findUniqueOrThrow({ where: { id: orderId } });

    await Promise.all(
      updates.map(({ orderDetailId, quantity }) =>
        prisma.orderDetail.update({
          where: { id: orderDetailId },
          data: { quantity },
        })
      )
    );

    const orderDetails = await prisma.orderDetail.findMany({
      where: { orderId },
      include: { product: true },
    });

    const newAmount = calculateOrderAmount(
      orderDetails.map((d) => ({ ...d, price: d.product.price }))
    );

    return prisma.order.update({
      where: { id: orderId },
      data: { amount: newAmount },
      include: { details: { include: { product: true } } },
    });
  } catch (error: any) {
    if (error.code === "P2025" || error.code === "P2021") {
      const notFoundError = new Error("Order not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to update multiple order products:", error);
    throw new Error("Failed to update multiple order products.");
  }
};

export const deleteOrderProduct = async (
  orderId: number,
  productId: number
) => {
  try {
    const orderDetail = await prisma.orderDetail.findFirstOrThrow({
      where: { orderId, productId },
      include: { product: true },
    });

    await prisma.orderDetail.delete({ where: { id: orderDetail.id } });

    const remainingDetails = await prisma.orderDetail.findMany({
      where: { orderId },
      include: { product: true },
    });

    const newAmount = calculateOrderAmount(
      remainingDetails.map((d) => ({ ...d, price: d.product.price }))
    );

    await prisma.order.update({
      where: { id: orderId },
      data: { amount: newAmount },
    });

    return orderDetail;
  } catch (error: any) {
    if (error.name === "NotFoundError") throw error;
    console.error("Failed to delete product from order:", error);
    throw new Error("Failed to delete product from order.");
  }
};

export const deleteAllOrderProducts = async (orderId: number) => {
  try {
    const deletedOrderDetails = await prisma.orderDetail.deleteMany({
      where: {
        orderId,
      },
    });

    if (deletedOrderDetails.count === 0) {
      const error = new Error("No products found in this order.");
      error.name = "NotFoundError";
      throw error;
    }

    return deletedOrderDetails;
  } catch (error: any) {
    if (error.code === "P2025" || error.code === "P2021") {
      const notFoundError = new Error("Order not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    if (error.name === "NotFoundError") {
      throw error;
    }

    console.error("Failed to delete products from order:", error);
    throw new Error("Failed to delete products from order.");
  }
};
