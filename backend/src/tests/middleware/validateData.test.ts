import { validateData } from "../../middlewares/validateMiddleware";
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

describe("validateData middleware", () => {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };

    res = {
      status: jest.fn().mockReturnThis() as any as Response["status"],
      json: jest.fn() as unknown as Response["json"],
    };

    next = jest.fn();
  });

  it("calls next() when validation passes", () => {
    req.body = { name: "John", age: 25 };

    validateData(schema)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("returns 400 with errors when validation fails", () => {
    req.body = { name: "John" };

    validateData(schema)(req as Request, res as Response, next);

    expect(res.status as jest.Mock).toHaveBeenCalledWith(400);
    expect(res.json as jest.Mock).toHaveBeenCalled();

    const responseArg = (res.json as jest.Mock).mock.calls[0][0];
    expect(responseArg.errors.length).toBeGreaterThan(0);
  });

  it("passes non-Zod errors to next()", () => {
    req.body = { name: "John", age: 25 };

    const customError = new Error("Test Error");

    const spy = jest.spyOn(schema, "parse").mockImplementation(() => {
      throw customError;
    });

    validateData(schema)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(customError);

    spy.mockRestore();
  });
});
