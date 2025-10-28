import * as orderService from "../../services/orderService";
import { prisma } from "../../lib/prisma";
import { calculateOrderAmount } from "../../utils/calculateOrderAmount";

jest.mock("../../lib/prisma", () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    orderDetail: {
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock("../../utils/calculateOrderAmount");

describe("Order Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  const mockOrder = { id: 1, customerId: 1, amount: 100 };
  const mockOrderDetail = { id: 1, productId: 1, price: 50, quantity: 2 };

  describe("getOrders", () => {
    it("should return paginated orders", async () => {
      (prisma.order.findMany as jest.Mock).mockResolvedValue([mockOrder]);
      (prisma.order.count as jest.Mock).mockResolvedValue(1);

      const result = await orderService.getOrders(1, 10);

      expect(result).toEqual({
        data: [mockOrder],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
      expect(prisma.order.findMany).toHaveBeenCalled();
      expect(prisma.order.count).toHaveBeenCalled();
    });

    it("should throw error on DB failure", async () => {
      (prisma.order.findMany as jest.Mock).mockRejectedValue(new Error("DB fail"));

      await expect(orderService.getOrders(1, 10)).rejects.toThrow(
        "Failed to fetch orders."
      );
    });
  });

  describe("getOrdersByCustomer", () => {
    it("should return orders for a customer", async () => {
      (prisma.order.findMany as jest.Mock).mockResolvedValue([mockOrder]);
      (prisma.order.count as jest.Mock).mockResolvedValue(1);

      const result = await orderService.getOrdersByCustomer(1, 1, 10);

      expect(result).toEqual({
        data: [mockOrder],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it("should throw error on DB failure", async () => {
      (prisma.order.findMany as jest.Mock).mockRejectedValue(new Error("DB fail"));

      await expect(orderService.getOrdersByCustomer(1, 1, 10)).rejects.toThrow(
        "Failed to fetch order by customer."
      );
    });
  });

  describe("getOrderById", () => {
    it("should return an order", async () => {
      (prisma.order.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(1);
      expect(result).toEqual(mockOrder);
    });

    it("should throw NotFoundError if order not found", async () => {
      (prisma.order.findUniqueOrThrow as jest.Mock).mockRejectedValue({ code: "P2025" });

      await expect(orderService.getOrderById(999)).rejects.toThrow(
        "Order not found."
      );
    });
  });

  describe("createOrder", () => {
    it("should create an order", async () => {
      (calculateOrderAmount as jest.Mock).mockReturnValue(100);
      (prisma.order.create as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(
        1,
        "ship addr",
        "order addr",
        "test@test.com",
        "pending",
        [{ productId: 1, price: 50, quantity: 2 }]
      );

      expect(result).toEqual(mockOrder);
    });

    it("should throw NotFoundError if create fails with P2025", async () => {
      (prisma.order.create as jest.Mock).mockRejectedValue({ code: "P2025" });

      await expect(
        orderService.createOrder(1, "s", "b", "e@test.com", "pending", [])
      ).rejects.toThrow("Order not found.");
    });
  });

  describe("updateOrderDetails", () => {
    it("should update an order", async () => {
      (prisma.order.update as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.updateOrderDetails(1, "shipped", "s", "b");
      expect(result).toEqual(mockOrder);
    });

    it("should throw NotFoundError if update fails", async () => {
      (prisma.order.update as jest.Mock).mockRejectedValue({ code: "P2025" });

      await expect(orderService.updateOrderDetails(999)).rejects.toThrow(
        "Order not found."
      );
    });
  });

  describe("deleteOrder", () => {
    it("should delete an order", async () => {
      (prisma.order.delete as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.deleteOrder(1);
      expect(result).toEqual(mockOrder);
    });

    it("should throw NotFoundError if delete fails", async () => {
      (prisma.order.delete as jest.Mock).mockRejectedValue({ code: "P2025" });

      await expect(orderService.deleteOrder(999)).rejects.toThrow(
        "Order not found."
      );
    });
  });

  describe("addProductsToOrder", () => {
    it("should add products to order", async () => {
      (prisma.order.update as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.addProductsToOrder(1, [mockOrderDetail]);
      expect(result).toEqual(mockOrder);
    });
  });

  describe("updateOrderProduct", () => {
    it("should update an order product", async () => {
      (prisma.orderDetail.update as jest.Mock).mockResolvedValue(mockOrderDetail);

      const result = await orderService.updateOrderProduct(1, { price: 60 });
      expect(result).toEqual(mockOrderDetail);
    });
  });

  describe("deleteOrderProduct", () => {
    it("should delete an order product", async () => {
      (prisma.orderDetail.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

      const result = await orderService.deleteOrderProduct(1, 1);
      expect(result).toEqual({ count: 1 });
    });

    it("should throw error if no product found", async () => {
      (prisma.orderDetail.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });

      await expect(orderService.deleteOrderProduct(1, 1)).rejects.toThrow(
        "No matching product found in this order."
      );
    });
  });
});
