import { useState, useEffect } from "react"
import {
  Box,
  Text,
  VStack,
  Button,
  Grid,
  HStack,
  Input,
} from "@chakra-ui/react"
import { productsData } from "../utils/mockData";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [page, setPage] = useState(productsData.pagination.page)
  const [searchQuery, setSearchQuery] = useState("")
  const limit = productsData.pagination.limit

  const filteredProducts = productsData.data.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredProducts.length / limit)

  const start = (page - 1) * limit
  const end = start + limit
  const currentProducts = filteredProducts.slice(start, end)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page])

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages))
  }

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  return (
    <Box px={{ base: 4, md: 10 }} py={6}>
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
        Shop
      </Text>

      {/* Search Bar */}
      <Box mb={10} w={{ base: "100%", md: "50%" }} mx="auto">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="gray.900"
          color="white"
          borderColor="purple.500"
        />
      </Box>

      <VStack>
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
          w="100%"
          mb={6}
        >
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>

        {/* Pagination */}
        <HStack gap={4}>
          <Button onClick={handlePrevious} disabled={page === 1}>
            Previous
          </Button>
          <Text>
            Page {page} of {totalPages || 1}
          </Text>
          <Button onClick={handleNext} disabled={page === totalPages || totalPages === 0}>
            Next
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
