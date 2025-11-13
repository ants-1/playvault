import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Text,
  VStack,
  Image,
  HStack,
  Badge,
  Button,
  Grid,
  Flex,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useGetProductQuery } from "../slices/productSlice";
import {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useAddProductToOrderMutation,
} from "../slices/orderApiSlice";
import { Toaster, toaster } from "../components/ui/toaster";
import type UserInfo from "../types/User";
import type Product from "../types/Product";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { userInfo } = useSelector((state: any) => state.auth) as {
    userInfo?: UserInfo;
  };
  const userId = userInfo?.user.userId || userInfo?.user.id;

  const { data: productResponse, isLoading, isError } = useGetProductQuery(id!, {
    skip: !id,
  });
  const product: Product | undefined = productResponse?.data;

  const [mainImage, setMainImage] = useState<string | undefined>(product?.thumbnail);

  useEffect(() => {
    if (product?.thumbnail) setMainImage(product.thumbnail);
  }, [product]);

  const { data: ordersData } = useGetOrdersQuery(
    { userId: userId, page: 1, limit: 10 },
    { skip: !userInfo }
  );

  const [createOrder] = useCreateOrderMutation();
  const [addProductToOrder] = useAddProductToOrderMutation();

  const handleAddToCart = async () => {
    if (!userInfo) {
      toaster.create({ description: "You must be logged in", type: "error" });
      return;
    }

    if (!product) return;

    try {
      const openOrder = ordersData?.data?.find(
        (order: any) => order.orderStatus === "open"
      );

      if (openOrder) {
        const existingProduct = openOrder.details.find(
          (item: any) => item.productId === product.id
        );

        console.log("Existing product in order:", existingProduct);

        if (existingProduct) {
          await addProductToOrder({
            orderId: openOrder.id,
            product: { productId: product.id, quantity: existingProduct.quantity + 1 },
          }).unwrap();
        } else {
          await addProductToOrder({
            orderId: openOrder.id,
            product: { productId: product.id, quantity: 1 },
          }).unwrap();
        }

        toaster.create({
          description: `${product.name} added to your existing order`,
          type: "success",
        });
        return;
      }

      await createOrder({
        customerId: Number(userId),
        shippingAddress: "",
        orderAddress: "",
        orderEmail: userInfo.user.email,
        orderStatus: "open",
        orderDetails: [{ productId: product.id, quantity: 1 }],
      }).unwrap();

      toaster.create({
        description: `${product.name} added to cart`,
        type: "success",
      });
    } catch (error: any) {
      console.error(error);
      toaster.create({
        description: error?.data?.message || error.message || "Failed to add product",
        type: "error",
      });
    }
  };

  if (isLoading) return <Box p={6} textAlign="center"><Text fontSize="2xl">Loading product...</Text></Box>;
  if (isError || !product) return <Box p={6} textAlign="center"><Text fontSize="2xl">Product not found</Text></Box>;

  return (
    <Box px={{ base: 4, md: 10 }} py={6}>
      <Toaster />
      <Flex gap={2} fontSize="sm" color="gray.400" mb={4} flexWrap="wrap" alignItems="center">
        <RouterLink to="/shop" style={{ textDecoration: "none" }}>
          <Text _hover={{ color: "purple.500", textDecoration: "underline" }} truncate maxW={{ base: "60px", md: "100px" }}>Shop</Text>
        </RouterLink>
        <Text>/</Text>
        <RouterLink to={`/shop?category=${product.categories.id}`} style={{ textDecoration: "none" }}>
          <Text _hover={{ color: "purple.500", textDecoration: "underline" }} truncate maxW={{ base: "80px", md: "150px" }}>{product.categories.name}</Text>
        </RouterLink>
        <Text>/</Text>
        <Text fontWeight="bold" color="purple.700" truncate maxW={{ base: "100px", md: "200px" }}>{product.name}</Text>
      </Flex>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} alignItems="start">
        <VStack align="start" gap={4}>
          <Image src={mainImage} alt={product.name} objectFit="cover" w="100%" maxH="400px" borderRadius="md" />
          <HStack gap={4} wrap="wrap">
            {product.images.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                w="100px" h="100px"
                objectFit="cover"
                borderRadius="md"
                cursor="pointer"
                border={mainImage === img ? "2px solid purple" : "none"}
                onClick={() => setMainImage(img)}
                _hover={{ border: "2px solid purple.500" }}
              />
            ))}
          </HStack>
        </VStack>

        <VStack align="start" gap={4}>
          <Text fontSize="3xl" fontWeight="bold">{product.name}</Text>
          <Text fontSize="lg" color="gray.300">{product.description}</Text>
          <Badge colorScheme="green">In Stock: {product.quantity}</Badge>
          <Text fontSize="2xl" fontWeight="bold">£{product.price}</Text>
          <Text fontSize="md" color="gray.400">Category: {product.categories.name}</Text>
          <Button colorScheme="purple" size="lg" w="full" onClick={handleAddToCart}>Add to Cart</Button>
        </VStack>
      </Grid>
    </Box>
  );
}
