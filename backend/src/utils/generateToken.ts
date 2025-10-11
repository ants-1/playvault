import jwt from "jsonwebtoken";

export const generateToken = (userId: number) => {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ id: userId }, secret, { expiresIn: "24hr" });
};
