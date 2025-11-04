import { useState } from "react";
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
import { productsData } from "../utils/mockData";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");

  const product = productsData.data.find((p) => p.id === productId);
  const [mainImage, setMainImage] = useState(product?.thumbnail);

  if (!product) {
    return (
      <Box p={6} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">
          Product not found
        </Text>
      </Box>
    );
  }

  return (
    <Box px={{ base: 4, md: 10 }} py={6}>
      <Flex
        gap={2}
        fontSize="sm"
        color="gray.400"
        mb={4}
        flexWrap="wrap"
        alignItems="center"
      >
        <RouterLink to="/shop" style={{ textDecoration: "none" }}>
          <Text
            _hover={{ color: "purple.500", textDecoration: "underline" }}
            truncate
            maxW={{ base: "60px", md: "100px" }}
          >
            Shop
          </Text>
        </RouterLink>
        <Text>/</Text>
        <RouterLink
          to={`/shop?category=${product.categories.id}`}
          style={{ textDecoration: "none" }}
        >
          <Text
            _hover={{ color: "purple.500", textDecoration: "underline" }}
            truncate
            maxW={{ base: "80px", md: "150px" }}
          >
            {product.categories.name}
          </Text>
        </RouterLink>
        <Text>/</Text>
        <Text
          fontWeight="bold"
          color="purple.700"
          truncate
          maxW={{ base: "100px", md: "200px" }}
        >
          {product.name}
        </Text>
      </Flex>

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={6}
        alignItems="start"
      >
        <VStack align="start" gap={4}>
          <Image
            src={mainImage}
            alt={product.name}
            objectFit="cover"
            w="100%"
            maxH="400px"
            borderRadius="md"
          />

          <HStack gap={4} wrap="wrap">
            {product.images.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                w="100px"
                h="100px"
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
          <Text fontSize="3xl" fontWeight="bold">
            {product.name}
          </Text>
          <Text fontSize="lg" color="gray.300">
            {product.description}
          </Text>
          <Badge colorScheme="green">In Stock: {product.quantity}</Badge>
          <Text fontSize="2xl" fontWeight="bold">
            ${product.price}
          </Text>
          <Text fontSize="md" color="gray.400">
            Category: {product.categories.name}
          </Text>

          <Button colorScheme="purple" size="lg" w="full">
            Add to Cart
          </Button>
        </VStack>
      </Grid>
    </Box>
  );
}
