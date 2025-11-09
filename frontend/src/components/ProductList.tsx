import { Box, Grid, Text } from "@chakra-ui/react";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: any;
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <>
      {products.length > 0 ? (
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
          w="100%"
          maxW="5xl"
          mb={6}
        >
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
      ) : (
        <Box
          w="100%"
          maxW="5xl"
          h="200px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="gray.400" fontSize="lg" textAlign="center">
            No products found.
          </Text>
        </Box>
      )}
    </>
  )
}