import { useState, useEffect } from "react";
import { Box, Text, Button, VStack, Image, SimpleGrid } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const heroImages = [
  "/controller-hero.jpg",
  "/game-hero.jpg",
  "/play-hero.jpg",
];


export default function App() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % heroImages.length);
        setFade(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" w="full" maxH="100vh" h="full" overflow="hidden">
        <Image
          src={heroImages[current]}
          alt="Hero"
          objectFit="cover"
          minH="90vh"
          w="full"
          h="full"
          transition="opacity 0.5s ease-in-out"
          opacity={fade ? 1 : 0}
        />
        <VStack
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          gap={4}
          textAlign="center"
          color="white"
        >
          <Text fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold" textShadow="2px 2px #000">
            <Box as="span">Welcome to Play</Box>
            <Box as="span" color="purple.500">Vault</Box>
          </Text>
          <Text fontSize={{ base: "md", md: "xl" }} textShadow="1px 1px #000">
            Your one-stop shop for the latest games and electronics
          </Text>
          <Link to="/shop">
            <Button colorScheme="purple" size="lg">
              Shop Now
            </Button>
          </Link>
        </VStack>
      </Box>

      {/* Features Section */}
      <Box py={20} px={{ base: 4, md: 20 }}>
        <Text fontSize="3xl" fontWeight="bold" mb={10} textAlign="center">
          Why Choose Us
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
          <VStack p={6} borderWidth="1px" borderRadius="md" borderColor="purple.500" gap={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Fast Shipping
            </Text>
            <Text textAlign="center">
              Get your products delivered in record time with our reliable shipping partners.
            </Text>
          </VStack>
          <VStack p={6} borderWidth="1px" borderRadius="md" borderColor="purple.500" gap={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Best Quality
            </Text>
            <Text textAlign="center">
              We carefully curate only the best gadgets and electronics for our customers.
            </Text>
          </VStack>
          <VStack p={6} borderWidth="1px" borderRadius="md" borderColor="purple.500" gap={2}>
            <Text fontSize="2xl" fontWeight="bold">
              24/7 Support
            </Text>
            <Text textAlign="center">
              Our friendly support team is here to help you anytime you need assistance.
            </Text>
          </VStack>
        </SimpleGrid>
      </Box>


      {/* Call to Action */}
      <Box px={{ base: 4, md: 10 }} py={20}>
        <Box py={20} px={{ base: 4, md: 20 }} bg="purple.600" borderRadius="lg" color="white" textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" mb={4}>
            Ready to find your next game?
          </Text>
          <Link to="/shop">
            <Button colorScheme="whiteAlpha" size="lg">
              Browse Products
            </Button>
          </Link>
        </Box>
      </Box>

    </Box>
  );
}
