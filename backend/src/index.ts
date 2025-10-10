import express, { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  try {
    const userEmail = "test@example.com";
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: "Test User",
          password: "password123",
        },
      });
    }

    res.send(`
      <h1>Test Page</h1>
      <p>User ID: ${user.id}</p>
      <p>Name: ${user.name}</p>
      <p>Email: ${user.email}</p>
      <p>Created At: ${user.createdAt}</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Sever running on http://localhost:${PORT}`);
});
