import request from "supertest";
import express, { json } from "express";
import * as orderService from "../../services/orderService";
import orderRoutes from "../../routes/orderRoutes";

jest.mock("../../services/orderService");

const app = express();
app.use(json());
app.use("/api/orders", orderRoutes);

describe("Order Routes with Validation", () => {
  afterEach(() => jest.clearAllMocks());

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  const mockOrder = { id: 1, customerId: 1 };
  const mockOrderDetail = { id: 1, productId: 1, quantity: 2 };

  describe("GET /api/orders", () => {
    it("returns paginated orders", async () => {
      (orderService.getOrders as jest.Mock).mockResolvedValue({
        data: [mockOrder],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      const res = await request(app).get("/api/orders?page=1&limit=10");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it("returns 400 on invalid page/limit", async () => {
      const res = await request(app).get("/api/orders?page=0&limit=-1");
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("returns 404 if invalid ID", async () => {
      const res = await request(app).get("/api/orders/NaN");
      expect(res.status).toBe(404);
    });

    it("returns 404 if order not found", async () => {
      const err = new Error("Order not found.");
      err.name = "NotFoundError";
      (orderService.getOrderById as jest.Mock).mockRejectedValue(err);

      const res = await request(app).get("/api/orders/999");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/orders/customers/:customerId", () => {
    it("returns 404 if invalid customerId", async () => {
      const res = await request(app).get("/api/orders/customers/NaN");
      expect(res.status).toBe(404);
    });

    it("returns 400 if page/limit invalid", async () => {
      const res = await request(app).get(
        "/api/orders/customers/1?page=-1&limit=0"
      );
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/orders", () => {
    it("returns 400 if required fields are missing", async () => {
      const res = await request(app).post("/api/orders").send({
        customerId: 1,
        shippingAddress: "s",
        orderAddress: "b",
        orderDetails: [{ productId: 1, quantity: 1 }],
      });

      expect(res.status).toBe(400);
    });

    it("creates an order successfully", async () => {
      (orderService.createOrder as jest.Mock).mockResolvedValue(mockOrder);

      const res = await request(app).post("/api/orders").send({
        customerId: 1,
        shippingAddress: "s",
        orderAddress: "b",
        orderEmail: "test@test.com",
        orderStatus: "pending",
        orderDetails: [{ productId: 1, quantity: 1 }],
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockOrder);
    });
  });

  describe("PUT /api/orders/:id", () => {
    it("returns 400 if invalid updates", async () => {
      const res = await request(app).put("/api/orders/1").send({
        orderStatus: 123,
      });

      expect(res.status).toBe(400);
    });

    it("updates an order successfully", async () => {
      (orderService.updateOrderDetails as jest.Mock).mockResolvedValue(
        mockOrder
      );

      const res = await request(app).put("/api/orders/1").send({
        orderStatus: "shipped",
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrder);
    });
  });

  describe("DELETE /api/orders/:id", () => {
    it("returns 404 if order does not exist", async () => {
      const err = new Error("Order not found.");
      err.name = "NotFoundError";
      (orderService.deleteOrder as jest.Mock).mockRejectedValue(err);

      const res = await request(app).delete("/api/orders/999");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/orders/:orderId/products", () => {
    it("returns 400 if product payload invalid", async () => {
      const res = await request(app)
        .post("/api/orders/1/products")
        .send({ product: "invalid" });
      expect(res.status).toBe(400);
    });

    it("adds product successfully", async () => {
      (orderService.addProductToOrder as jest.Mock).mockResolvedValue(mockOrder);

      const res = await request(app)
        .post("/api/orders/1/products")
        .send({ productId: 104, quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrder);
    });
  });

  describe("PUT /api/orders/products/:orderDetailId", () => {
    it("returns 400 for invalid update data", async () => {
      const res = await request(app)
        .put("/api/orders/products/1")
        .send({ updates: [{ orderDetailId: 1, quantity: -1 }] });
      expect(res.status).toBe(400);
    });

    it("updates product successfully", async () => {
      (orderService.updateOrderProducts as jest.Mock).mockResolvedValue(
        mockOrder
      );

      const res = await request(app)
        .put("/api/orders/products/1")
        .send({ updates: [{ orderDetailId: 1, quantity: 2 }] });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockOrder);
    });
  });

  describe("DELETE /api/orders/:orderId/products/:productId", () => {
    it("returns 404 if product not in order", async () => {
      const err = new Error("No matching product found in this order.");
      err.name = "NotFoundError";
      (orderService.deleteOrderProduct as jest.Mock).mockRejectedValue(err);

      const res = await request(app).delete("/api/orders/1/products/999");
      expect(res.status).toBe(404);
    });

    it("deletes product successfully", async () => {
      (orderService.deleteOrderProduct as jest.Mock).mockResolvedValue(
        mockOrderDetail
      );

      const res = await request(app).delete("/api/orders/1/products/1");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Product removed from order");
    });
  });

  describe("FULL COVERAGE EXTRA TESTS", () => {
    it("GET /orders returns 404 when service returns null", async () => {
      (orderService.getOrders as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get("/api/orders?page=1&limit=10");
      expect(res.status).toBe(404);
    });

    it("GET /orders handles internal server error", async () => {
      (orderService.getOrders as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      const res = await request(app).get("/api/orders?page=1&limit=10");
      expect(res.status).toBe(500);
    });

    it("GET /orders/:id returns 404 when !id", async () => {
      const res = await request(app).get("/api/orders/0");
      expect(res.status).toBe(404);
    });

    it("GET /orders/customers/:customerId returns 404 when !customerId", async () => {
      const res = await request(app).get("/api/orders/customers/0");
      expect(res.status).toBe(404);
    });

    it("POST /orders handles createOrder throwing error", async () => {
      (orderService.createOrder as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      const res = await request(app).post("/api/orders").send({
        customerId: 1,
        shippingAddress: "s",
        orderAddress: "b",
        orderEmail: "test@test.com",
        orderStatus: "pending",
        orderDetails: [{ productId: 1, quantity: 1 }],
      });

      expect(res.status).toBe(500);
    });

    it("PUT /orders/:id handles service exception", async () => {
      (orderService.updateOrderDetails as jest.Mock).mockRejectedValue(
        new Error("fail")
      );

      const res = await request(app)
        .put("/api/orders/1")
        .send({ orderStatus: "shipped" });

      expect(res.status).toBe(500);
    });

    it("DELETE /orders/:id success", async () => {
      (orderService.deleteOrder as jest.Mock).mockResolvedValue(mockOrder);

      const res = await request(app).delete("/api/orders/1");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Order deleted successfully");
    });

    it("POST /orders/:id/products NotFoundError", async () => {
      const err = new Error("order not found");
      err.name = "NotFoundError";
      (orderService.addProductToOrder as jest.Mock).mockRejectedValue(err);

      const res = await request(app)
        .post("/api/orders/1/products")
        .send({ productId: 1, quantity: 2 });

      expect(res.status).toBe(404);
    });

    it("PUT /orders/products/:id NotFoundError", async () => {
      const err = new Error("not found");
      err.name = "NotFoundError";
      (orderService.updateOrderProducts as jest.Mock).mockRejectedValue(err);

      const res = await request(app)
        .put("/api/orders/products/1")
        .send({ updates: [{ orderDetailId: 1, quantity: 1 }] });

      expect(res.status).toBe(404);
    });

    it("DELETE /orders/:id/products all success", async () => {
      (orderService.deleteAllOrderProducts as jest.Mock).mockResolvedValue({
        count: 2,
      });

      const res = await request(app).delete("/api/orders/1/products");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("All products removed from order");
    });

    it("DELETE /orders/:id/products throws NotFoundError", async () => {
      const err = new Error("not found");
      err.name = "NotFoundError";
      (orderService.deleteAllOrderProducts as jest.Mock).mockRejectedValue(err);

      const res = await request(app).delete("/api/orders/1/products");
      expect(res.status).toBe(404);
    });
  });
});
