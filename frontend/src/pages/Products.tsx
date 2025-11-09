import { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useGetCategoriesQuery } from "../slices/categorySlice";
import { useGetProductsQuery } from "../slices/productSlice";
import Pagination from "../components/Pagination";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import CategorySelection from "../components/CategorySelection";

export default function Products() {
  const { data: categoryData } = useGetCategoriesQuery(undefined);
  const { data: productsData } = useGetProductsQuery(undefined);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const limit = 9; 

  const categoriesFromApi = categoryData?.data ?? [];
  const productsArray = productsData?.data ?? [];

  const categories = [{ id: 0, name: "All", thumbnail: "https://res.cloudinary.com/dhdlno07z/image/upload/v1762635858/products/txghsmjldcymnvjnnu7i.jpg" }, ...categoriesFromApi];

  const filteredProducts = productsArray.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "All") return matchesSearch;

    const productCategories = product.categories
      ? Array.isArray(product.categories)
        ? product.categories
        : [product.categories]
      : [];
    return matchesSearch && productCategories.some((c: any) => c.name === selectedCategory);
  });

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const currentProducts = filteredProducts.slice((page - 1) * limit, page * limit);

  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [page]);
  useEffect(() => setPage(1), [searchQuery, selectedCategory]);

  return (
    <Box px={{ base: 4, md: 10 }} py={6} justifyContent="center" alignItems="center">
      <CategorySelection
        categories={categories}
        productsArray={productsArray}
        selectedCategory={selectedCategory}
        onSelectedCategory={setSelectedCategory}
      />

      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mt={16} mb={6}>
        {selectedCategory === "All" ? "All Products" : `${selectedCategory} Products`}
      </Text>

      <SearchBar
        searchQuery={searchQuery}
        onSearchQuery={setSearchQuery}
      />

      <VStack>
        <ProductList
          products={currentProducts}
        />

        <Pagination
          page={page}
          onPage={setPage}
          totalPages={totalPages}
        />
      </VStack>
    </Box>
  );
}
