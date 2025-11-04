import { useState } from "react";
import { Box, Text, VStack, HStack, Image, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { productsData } from "../utils/mockData";

type CartItem = {
  productId: number;
  quantity: number;
};

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 2 },
  ]);

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== id));
  };

  const handleQuantityChange = (id: number, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === id ? { ...item, quantity: Math.max(1, qty) } : item
      )
    );
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const product = productsData.data.find((p) => p.id === item.productId);
    return product ? acc + product.price * item.quantity : acc;
  }, 0);

  return (
    <VStack px={{ base: 4, md: 10 }} py={6} >
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Your Cart
      </Text>

      <VStack align="stretch" gap={4} maxW="4xl" w="full">
        {cartItems.length === 0 ? (
          <Box textAlign="center" py={20}>
            <Text fontSize="2xl" fontWeight="bold">
              Your cart is empty.
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={4}>
            {cartItems.map((item) => {
              const product = productsData.data.find((p) => p.id === item.productId);
              if (!product) return null;

              return (
                <HStack
                  key={item.productId}
                  maxW="4xl"
                  w="full"
                  gap={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="purple.500"
                  p={4}
                >
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    borderRadius="md"
                    boxSize="100px"
                    objectFit="cover"
                  />
                  <VStack align="start" gap={1} flex="1">
                    <Text fontWeight="bold">{product.name}</Text>
                    <Text>£{product.price}</Text>
                    <HStack>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                      <Text>{item.quantity}</Text>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                    </HStack>
                  </VStack>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </Button>
                </HStack>
              );
            })}

            <HStack justifyContent="space-between">
              <Text fontSize="xl" fontWeight="bold">
                Total: £{totalPrice}
              </Text>
              <Link to="/checkout">
                <Button colorScheme="purple" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
            </HStack>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
}
