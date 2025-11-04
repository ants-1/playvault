import {
  Box,
  Image,
  Text,
  VStack,
  Badge,
  Button,
} from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { productsData } from "../utils/mockData"

export default function ProductCard({ product }: { product: typeof productsData.data[0] }) {
  return (
    <Box
      borderWidth="1px"
      borderColor="purple.500"
      borderRadius="lg"
      overflow="hidden"
      bg="gray.800"
      _hover={{ boxShadow: "lg" }}
      display="flex"
      flexDirection="column"
      h="100%"
    >
      <Image
        src={product.thumbnail}
        alt={product.name}
        objectFit="cover"
        w="100%"
        h="200px"
      />

      <VStack align="start" p={4} gap={2} flex="1">
        <Text fontWeight="bold" fontSize="lg">
          {product.name}
        </Text>
        <Text fontSize="sm" color="gray.300">
          {product.description}
        </Text>
        <Badge colorScheme="green">In Stock: {product.quantity}</Badge>
        <Text fontSize="lg" fontWeight="bold">
          ${product.price}
        </Text>
        <Text fontSize="sm" color="gray.400">
          Category: {product.categories.name}
        </Text>
        <Box mt="auto" w="full">
          <Link to={`/products/${product.id}`}>
            <Button colorScheme="red" size="sm" w="full">
              View Details
            </Button>
          </Link>
        </Box>
      </VStack>
    </Box>
  )
}