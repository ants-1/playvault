import jwt from "jsonwebtoken";
import { authenticateJWT, AuthRequest } from "../../middlewares/authenticateJWT";
import { Request, Response, NextFunction } from "express";

jest.mock("jsonwebtoken");

describe("authenticateJWT", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("returns 401 if no token is provided", () => {
    authenticateJWT(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("calls next() and attaches user if token is valid", () => {
    req.headers = { authorization: "Bearer validtoken" };

    (jwt.verify as jest.Mock).mockReturnValue({ id: "123" });

    authenticateJWT(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect((req as AuthRequest).user).toEqual({ id: "123" });
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 if token is invalid", () => {
    req.headers = { authorization: "Bearer invalidtoken" };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid");
    });

    authenticateJWT(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });
});
