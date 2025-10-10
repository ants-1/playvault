import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Users
  const userOne = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice Johnson",
      password: "hashed_password_123",
    },
  });
  const userTwo = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob Smith",
      password: "hashed_password_456",
    },
  });

  // Categories
  const categoryOne = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Devices and gadgets",
      thumbnail: "N/A",
    },
  });
  const categoryTwo = await prisma.category.create({
    data: {
      name: "Clothing",
      description: "Fashion and apparel",
      thumbnail: "N/A",
    },
  });

  // Products
  const productOne = await prisma.product.create({
    data: {
      name: "Wireless Headphones",
      description: "Noise-cancelling over-ear headphones",
      quantity: 20,
      price: 99.99,
      thumbnail: "N/A",
      images: ["N/A", "N/A"],
      categories: { connect: { id: categoryOne.id } },
    },
  });
  const productTwo = await prisma.product.create({
    data: {
      name: "T-Shirt",
      description: "100% cotton, size L",
      quantity: 50,
      price: 19.99,
      thumbnail: "N/A",
      images: ["N/A"],
      categories: { connect: { id: categoryTwo.id } },
    },
  });

  // Orders
  const orderOne = await prisma.order.create({
    data: {
      customerId: userOne.id,
      amount: 119.98,
      shippingAddress: "123 Main St, London",
      orderAddress: "123 Main St, London",
      orderEmail: userOne.email,
      orderStatus: "Processing",
      details: {
        create: [
          {
            productId: productOne.id,
            price: productOne.price,
            quantity: 1,
          },
          {
            productId: productTwo.id,
            price: productTwo.price,
            quantity: 1,
          },
        ],
      },
    },
  });

  console.log("Seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
