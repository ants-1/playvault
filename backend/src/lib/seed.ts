import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing database...");

  // Delete all products and categories
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("Database cleared. Starting seed...");

  // Categories
  const electronicsCategory = await prisma.category.create({
    data: {
      name: "Electronics",
      description: "Devices and gadgets",
      thumbnail:
        "https://res.cloudinary.com/dhdlno07z/image/upload/v1762636213/products/gx7gvsmjfzmdg0ttxkt1.jpg",
    },
  });

  const gamingCategory = await prisma.category.create({
    data: {
      name: "Gaming",
      description: "Video games",
      thumbnail:
        "https://res.cloudinary.com/dhdlno07z/image/upload/v1762634538/products/a4avtarvq6zel7fhsygx.jpg",
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: "Accessories",
      description: "Accessory related to gaming",
      thumbnail:
        "https://res.cloudinary.com/dhdlno07z/image/upload/v1762636073/products/uiu2zsqfqongdtlduuvn.jpg",
    },
  });

  // Images per category
  const electronicsImages = [
    "https://res.cloudinary.com/dhdlno07z/image/upload/v1762636217/products/rwolemxgimuyzuzmuwee.jpg",
    "https://res.cloudinary.com/dhdlno07z/image/upload/v1762636215/products/nnyyo9semebuag7bmuln.jpg",
  ];

  const gamingImages = [
    "https://res.cloudinary.com/dhdlno07z/image/upload/v1762636529/products/oeajnufadbwwke7b4pmn.jpg",
    "https://res.cloudinary.com/dhdlno07z/image/upload/v1762636532/products/caly4dttf9k97fpuuti0.jpg",
  ];

  const accessoriesImages = [
    "https://res.cloudinary.com/dhdlno07z/image/upload/v1762636074/products/qgczl15ik4xudbzkqmrp.jpg",
    "https://res.cloudinary.com/dhdlno07z/image/upload/v1762636074/products/ec4a2kgkockrsemilkqf.jpg",
  ];

  const categories = [
    { cat: electronicsCategory, images: electronicsImages },
    { cat: gamingCategory, images: gamingImages },
    { cat: accessoriesCategory, images: accessoriesImages },
  ];

  // Generate 100 products
  for (let i = 1; i <= 100; i++) {
    const categoryIndex = i % categories.length;
    const category = categories[categoryIndex];
    const images = category.images;

    await prisma.product.create({
      data: {
        name: `${category.cat.name} Product ${i}`,
        description: `Description for ${category.cat.name} product ${i}`,
        quantity: Math.floor(Math.random() * 50) + 1,
        price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
        thumbnail: images[0],
        images: images,
        categories: { connect: { id: category.cat.id } },
      },
    });
  }

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
