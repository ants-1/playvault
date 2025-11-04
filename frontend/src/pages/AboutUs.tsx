import { Box, Text, VStack, SimpleGrid } from "@chakra-ui/react";

export default function AboutUs() {
  return (
    <Box px={{ base: 4, md: 20 }} py={10}>
      {/* Hero Section */}
      <Box px={{ base: 4, md: 10 }} mb={20}>
        <Box py={20} px={{ base: 4, md: 20 }} bg="purple.600" borderRadius="lg" color="white" textAlign="center">
          <Text fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold">
            About Us
          </Text>
          <Text fontSize={{ base: "md", md: "xl" }}>
            Learn more about PlayVault and our mission
          </Text>
        </Box>
      </Box>

      {/* Mission Section */}
      <VStack align="stretch" gap={6} mb={20}>
        <Text fontSize="3xl" fontWeight="bold" textAlign="center">
          Our Mission
        </Text>
        <Text fontSize="lg" textAlign="center">
          At PlayVault, our mission is to bring the latest and greatest
          electronics and gaming products to enthusiasts worldwide. We strive
          to provide high-quality products, fast shipping, and exceptional
          customer support.
        </Text>
      </VStack>

      {/* Values Section */}
      <VStack align="stretch" gap={6}>
        <Text fontSize="3xl" fontWeight="bold" textAlign="center">
          Our Values
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
          <VStack p={6} borderWidth="1px" borderRadius="md" borderColor="purple.500" gap={2}>
            <Text fontSize="2xl" fontWeight="bold">Quality</Text>
            <Text textAlign="center">We only select top-quality products for our customers.</Text>
          </VStack>
          <VStack p={6} borderWidth="1px" borderRadius="md" borderColor="purple.500" gap={2}>
            <Text fontSize="2xl" fontWeight="bold">Innovation</Text>
            <Text textAlign="center">We keep up with the latest trends in electronics and gaming.</Text>
          </VStack>
          <VStack p={6} borderWidth="1px" borderRadius="md" borderColor="purple.500" gap={2}>
            <Text fontSize="2xl" fontWeight="bold">Support</Text>
            <Text textAlign="center">Our customers always come first.</Text>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
