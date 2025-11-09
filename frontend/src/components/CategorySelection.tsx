import { Box, Grid, Text } from "@chakra-ui/react";

interface CategorySelectionProps {
  categories: any;
  productsArray: any;
  selectedCategory: string;
  onSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

export default function CategorySelection({ categories, productsArray, selectedCategory, onSelectedCategory: setSelectedCategory }: CategorySelectionProps) {
  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        sm: "repeat(2, 1fr)",
        lg: "repeat(4, 1fr)",
      }}
      gap={6}
      w="100%"
      maxW="5xl"
      mx="auto"
      mb={6}
      justifyContent="center"
    >
      {categories.map((category: any) => {
        const productCount =
          category.name === "All"
            ? productsArray.length
            : productsArray.filter((product: any) => {
              const productCategories = product.categories
                ? Array.isArray(product.categories)
                  ? product.categories
                  : [product.categories]
                : [];
              return productCategories.some((c: any) => c.name === category.name);
            }).length;

        return (
          <Box
            key={category.id}
            borderWidth="1px"
            borderColor="purple.500"
            borderRadius="lg"
            overflow="hidden"
            bg="gray.800"
            display="flex"
            flexDir="row"
            justifyContent="space-between"
            alignItems="flex-end"
            h="200px"
            px="6"
            py="2"
            bgImage={category.thumbnail ? `url('${category.thumbnail}')` : undefined}
            bgSize="cover"
            bgPos="center"
            bgRepeat="no-repeat"
            cursor="pointer"
            opacity={selectedCategory === category.name ? 0.5 : 1}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category.name ? "All" : category.name
              )
            }
            _hover={{
              transform: "scale(1.03)",
              transition: "0.3s",
              opacity: selectedCategory === category.name ? 0.5 : 0.9,
            }}
            transition="all 0.3s"
          >
            <Text fontSize="xl" fontWeight="bold" textShadow="2px 2px #000">
              {category.name}
            </Text>
            <Text fontSize="xl" fontWeight="bold" textShadow="2px 2px #000">
              {productCount}
            </Text>
          </Box>
        );
      })}
    </Grid>
  )
}