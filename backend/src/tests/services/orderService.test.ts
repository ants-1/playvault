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
      findFirst: jest.fn(),
      findFirstOrThrow: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    product: {
      findUniqueOrThrow: jest.fn(),
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

  const mockOrder = { id: 1, customerId: 1, amount: 100, details: [], customer: {} };
  const mockOrderDetail = { id: 1, productId: 1, quantity: 2, product: { price: 50 } };
  const mockProduct = { id: 1, price: 50 };

  // ------------------ EXISTING TESTS ------------------ //
  describe("getOrders", () => {
    it("returns paginated orders", async () => {
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

    it("throws error if DB fails", async () => {
      (prisma.order.findMany as jest.Mock).mockRejectedValue(new Error("DB fail"));

      await expect(orderService.getOrders(1, 10)).rejects.toThrow(
        "Failed to fetch orders."
      );
    });
  });

  describe("getOrdersByCustomer", () => {
    it("returns orders for a customer", async () => {
      (prisma.order.findMany as jest.Mock).mockResolvedValue([mockOrder]);
      (prisma.order.count as jest.Mock).mockResolvedValue(1);

      const result = await orderService.getOrdersByCustomer(1, 1, 10);

      expect(result).toEqual({
        data: [mockOrder],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });
  });

  describe("getOrderById", () => {
    it("returns an order", async () => {
      (prisma.order.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(1);
      expect(result).toEqual(mockOrder);
    });

    it("throws NotFoundError if not found", async () => {
      (prisma.order.findUniqueOrThrow as jest.Mock).mockRejectedValue({ code: "P2025" });

      await expect(orderService.getOrderById(999)).rejects.toThrow("Order not found.");
    });
  });

  describe("createOrder", () => {
    it("creates an order", async () => {
      (prisma.product.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockProduct);
      (calculateOrderAmount as jest.Mock).mockReturnValue(100);
      (prisma.order.create as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(
        1,
        "ship addr",
        "order addr",
        "test@test.com",
        "pending",
        [{ productId: 1, quantity: 2 }]
      );

      expect(result).toEqual(mockOrder);
    });
  });

  describe("updateOrderDetails", () => {
    it("updates an order", async () => {
      (prisma.order.update as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.updateOrderDetails(1, "shipped", "s", "b");
      expect(result).toEqual(mockOrder);
    });
  });

  describe("deleteOrder", () => {
    it("deletes an order", async () => {
      (prisma.order.delete as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.deleteOrder(1);
      expect(result).toEqual(mockOrder);
    });
  });

  describe("addProductToOrder", () => {
    it("adds a product to order", async () => {
      (prisma.order.findUniqueOrThrow as jest.Mock).mockResolvedValue({ details: [], id: 1 });
      (prisma.orderDetail.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.orderDetail.create as jest.Mock).mockResolvedValue(mockOrderDetail);
      (prisma.order.update as jest.Mock).mockResolvedValue(mockOrder);
      (prisma.order.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        details: [mockOrderDetail],
        id: 1,
      });
      (calculateOrderAmount as jest.Mock).mockReturnValue(100);

      const result = await orderService.addProductToOrder(1, { productId: 1, quantity: 2 });
      expect(result).toEqual(mockOrder);
    });
  });

  describe("updateOrderProducts", () => {
    it("updates multiple products in an order", async () => {
      (prisma.order.findUniqueOrThrow as jest.Mock).mockResolvedValue({ id: 1 });
      (prisma.orderDetail.findMany as jest.Mock).mockResolvedValue([mockOrderDetail]);
      (calculateOrderAmount as jest.Mock).mockReturnValue(100);
      (prisma.order.update as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.updateOrderProducts(1, [{ orderDetailId: 1, quantity: 5 }]);
      expect(result).toEqual(mockOrder);
    });
  });

  describe("deleteOrderProduct", () => {
    it("deletes a single product from order", async () => {
      (prisma.orderDetail.findFirstOrThrow as jest.Mock).mockResolvedValue(mockOrderDetail);
      (prisma.orderDetail.delete as jest.Mock).mockResolvedValue(mockOrderDetail);
      (prisma.orderDetail.findMany as jest.Mock).mockResolvedValue([]);
      (calculateOrderAmount as jest.Mock).mockReturnValue(0);
      (prisma.order.update as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.deleteOrderProduct(1, 1);
      expect(result).toEqual(mockOrderDetail);
    });
  });

  describe("deleteAllOrderProducts", () => {
    it("deletes all products from order", async () => {
      (prisma.orderDetail.deleteMany as jest.Mock).mockResolvedValue({ count: 2 });

      const result = await orderService.deleteAllOrderProducts(1);
      expect(result).toEqual({ count: 2 });
    });
  });

  // ------------------ NEW TESTS FOR FULL COVERAGE ------------------ //
  describe("getOrders - error handling", () => {
    it("throws if prisma.count fails", async () => {
      (prisma.order.findMany as jest.Mock).mockResolvedValue([mockOrder]);
      (prisma.order.count as jest.Mock).mockRejectedValue(new Error("fail"));

      await expect(orderService.getOrders(1, 10)).rejects.toThrow("Failed to fetch orders.");
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getOrdersByCustomer - error handling", () => {
    it("throws if prisma.findMany fails", async () => {
      (prisma.order.findMany as jest.Mock).mockRejectedValue(new Error("fail"));

      await expect(orderService.getOrdersByCustomer(1, 1, 10)).rejects.toThrow(
        "Failed to fetch order by customer."
      );
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getOrderById - unknown error", () => {
    it("throws general error if prisma fails with unknown code", async () => {
      (prisma.order.findUniqueOrThrow as jest.Mock).mockRejectedValue({ code: "UNKNOWN" });

      await expect(orderService.getOrderById(1)).rejects.toThrow("Failed to fetch order by ID.");
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("createOrder - error handling", () => {
    it("throws NotFoundError if product not found", async () => {
      (prisma.product.findUniqueOrThrow as jest.Mock).mockRejectedValue({ code: "P2025" });

      await expect(
        orderService.createOrder(1, "s", "o", "e@test.com", "pending", [{ productId: 1, quantity: 1 }])
      ).rejects.toThrow("Order not found.");
    });

    it("throws general error if create fails", async () => {
      (prisma.product.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockProduct);
      (calculateOrderAmount as jest.Mock).mockReturnValue(50);
      (prisma.order.create as jest.Mock).mockRejectedValue(new Error("fail"));

      await expect(
        orderService.createOrder(1, "s", "o", "e@test.com", "pending", [{ productId: 1, quantity: 1 }])
      ).rejects.toThrow("Failed to create order.");
    });
  });

  describe("updateOrderDetails - error handling", () => {
    it("throws NotFoundError if order not found", async () => {
      (prisma.order.update as jest.Mock).mockRejectedValue({ code: "P2025" });

      await expect(orderService.updateOrderDetails(999, "shipped")).rejects.toThrow("Order not found.");
    });

    it("throws general error if update fails", async () => {
      (prisma.order.update as jest.Mock).mockRejectedValue(new Error("fail"));

      await expect(orderService.updateOrderDetails(1, "shipped")).rejects.toThrow("Failed to update order.");
    });
  });

  describe("deleteOrder - error handling", () => {
    it("throws NotFoundError if order not found", async () => {
      (prisma.order.delete as jest.Mock).mockRejectedValue({ code: "P2025" });

      await expect(orderService.deleteOrder(999)).rejects.toThrow("Order not found.");
    });

    it("throws general error if delete fails", async () => {
      (prisma.order.delete as jest.Mock).mockRejectedValue(new Error("fail"));

      await expect(orderService.deleteOrder(1)).rejects.toThrow("Failed to delete order.");
    });
  });

  describe("addProductToOrder - error handling", () => {
    it("throws if prisma.findUniqueOrThrow fails", async () => {
      (prisma.order.findUniqueOrThrow as jest.Mock).mockRejectedValue(new Error("fail"));

      await expect(orderService.addProductToOrder(1, { productId: 1, quantity: 1 })).rejects.toThrow(
        "Failed to add product to order."
      );
    });
  });

  describe("updateOrderProducts - NotFoundError path", () => {
    it("throws NotFoundError if order not found", async () => {
      (prisma.order.findUniqueOrThrow as jest.Mock).mockRejectedValue({ code: "P2025" });

      await expect(orderService.updateOrderProducts(999, [{ orderDetailId: 1, quantity: 1 }])).rejects.toThrow(
        "Order not found."
      );
    });
  });

  describe("deleteOrderProduct - error handling", () => {
    it("throws error if delete fails", async () => {
      (prisma.orderDetail.findFirstOrThrow as jest.Mock).mockRejectedValue(new Error("fail"));

      await expect(orderService.deleteOrderProduct(1, 1)).rejects.toThrow(
        "Failed to delete product from order."
      );
    });
  });

  describe("deleteAllOrderProducts - error handling", () => {
    it("throws NotFoundError if no products in order", async () => {
      (prisma.orderDetail.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });

      await expect(orderService.deleteAllOrderProducts(1)).rejects.toThrow("No products found in this order.");
    });

    it("throws general error if deleteMany fails", async () => {
      (prisma.orderDetail.deleteMany as jest.Mock).mockRejectedValue(new Error("fail"));

      await expect(orderService.deleteAllOrderProducts(1)).rejects.toThrow(
        "Failed to delete products from order."
      );
    });
  });
});
