import { Box, Flex, Text, HStack, VStack, Input, Button } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <Box bg="gray.900" px="10" py="12">
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        maxW="1200px"
        mx="auto"
      >

        <HStack gap="16" mb={{ base: 6, md: 0 }} align="start">
          <VStack align="start" mb={{ base: 6, md: 0 }}>
            <Text fontSize="xl" fontWeight="bold">
              PlayVault
            </Text>
            <Text fontSize="sm" maxW="250px">
              High-quality electronics, games, and accessories delivered fast to your door.
            </Text>
          </VStack>
          <VStack align="start">
            <Text fontWeight="bold">Company</Text>
            <Text>About Us</Text>
          </VStack>

          <VStack align="start">
            <Text fontWeight="bold">Help</Text>
            <Text>FAQ</Text>
            <Text>Shipping</Text>
            <Text>Returns</Text>
          </VStack>
        </HStack>

        <VStack align="start">
          <Text fontWeight="bold">Newsletter</Text>
          <Text fontSize="sm" maxW="250px">
            Subscribe for updates on new products and special offers.
          </Text>
          <HStack>
            <Input placeholder="Enter your email" size="sm" bg="white" color="black" />
            <Button size="sm" variant="surface">
              Subscribe
            </Button>
          </HStack>
          <HStack gap="3" pt="4">
            <FaFacebook size={20} />
            <FaTwitter size={20} />
            <FaInstagram size={20} />
          </HStack>
        </VStack>
      </Flex>

      {/* Bottom */}
      <Text textAlign="center" pt="10" fontSize="sm" borderTop="1px solid" borderColor="gray.700" mt="6">
        © {new Date().getFullYear()} PlayVault. All rights reserved.
      </Text>
    </Box>
  );
}
