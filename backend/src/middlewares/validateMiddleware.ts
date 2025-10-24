import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validateData =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((issue) => issue.message);
        return res.status(400).json({ errors: messages });
      }
      next(error);
    }
  };
