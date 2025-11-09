import { useState, useEffect } from "react";
import {
  Box,
  createListCollection,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useGetCategoriesQuery } from "../slices/categorySlice";
import { useGetProductsQuery } from "../slices/productSlice";
import Pagination from "../components/Pagination";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import CategorySelection from "../components/CategorySelection";
import SortDropdown from "../components/SortDropdown";

export default function Products() {
  const { data: categoryData } = useGetCategoriesQuery(undefined);
  const { data: productsData } = useGetProductsQuery(undefined);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortValue, setSortValue] = useState<string[]>([]);

  const limit = 9;

  const categoriesFromApi = categoryData?.data ?? [];
  const productsArray = productsData?.data ?? [];

  const categories = [
    {
      id: 0,
      name: "All",
      thumbnail:
        "https://res.cloudinary.com/dhdlno07z/image/upload/v1762635858/products/txghsmjldcymnvjnnu7i.jpg",
    },
    ...categoriesFromApi,
  ];

  const filteredProducts = productsArray.filter((product: any) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (selectedCategory === "All") return matchesSearch;

    const productCategories = product.categories
      ? Array.isArray(product.categories)
        ? product.categories
        : [product.categories]
      : [];

    return (
      matchesSearch &&
      productCategories.some((c: any) => c.name === selectedCategory)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const sortKey = sortValue[0] || "";
    switch (sortKey) {
      case "A-Z":
        return a.name.localeCompare(b.name);
      case "Z-A":
        return b.name.localeCompare(a.name);
      case "Price (Low-High)":
        return a.price - b.price;
      case "Price (High-Low)":
        return b.price - a.price;
      case "Stock (Low-High)":
        return a.quantity - b.quantity;
      case "Stock (High-Low)":
        return b.quantity - a.quantity;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / limit);
  const currentProducts = sortedProducts.slice(
    (page - 1) * limit,
    page * limit
  );

  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [page]);
  useEffect(() => setPage(1), [searchQuery, selectedCategory, sortValue]);

  const sortOptions = createListCollection({
    items: [
      { label: "Name (A-Z)", value: "A-Z" },
      { label: "Name (Z-A)", value: "Z-A" },
      { label: "Price (Low-High)", value: "Price (Low-High)" },
      { label: "Price (High-Low)", value: "Price (High-Low)" },
      { label: "Stock (Low-High)", value: "Stock (Low-High)" },
      { label: "Stock (High-Low)", value: "Stock (High-Low)" },
    ],
  });

  return (
    <Box
      px={{ base: 4, md: 10 }}
      py={6}
      justifyContent="center"
      alignItems="center"
    >
      <CategorySelection
        categories={categories}
        productsArray={productsArray}
        selectedCategory={selectedCategory}
        onSelectedCategory={setSelectedCategory}
      />

      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mt={16} mb={6}>
        {selectedCategory === "All"
          ? "All Products"
          : `${selectedCategory} Products`}
      </Text>

      <Flex flexDir="column"alignItems="center">
        <SearchBar searchQuery={searchQuery} onSearchQuery={setSearchQuery} />

        <SortDropdown
          sortOptions={sortOptions}
          sortValue={sortValue}
          onSortValue={setSortValue}
        />
      </Flex>

      <VStack>
        <ProductList products={currentProducts} />

        <Pagination page={page} onPage={setPage} totalPages={totalPages} />
      </VStack>
    </Box>
  );
}
