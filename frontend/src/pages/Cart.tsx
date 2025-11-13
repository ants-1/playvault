import { useState, useEffect } from "react";
import { Box, Text, VStack, HStack, Image, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetOrdersQuery,
  useAddProductToOrderMutation,
  useRemoveOrderProductMutation,
} from "../slices/orderApiSlice";
import type UserInfo from "../types/User";

export default function Cart() {
  const { userInfo } = useSelector((state: any) => state.auth) as {
    userInfo?: UserInfo;
  };
  const userId = userInfo?.user.userId || userInfo?.user.id;

  const { data: ordersData, isLoading } = useGetOrdersQuery(
    { userId: userId, page: 1, limit: 10 },
    {
      skip: !userInfo,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const [addProductToOrder] = useAddProductToOrderMutation();
  const [removeProductFromOrder] = useRemoveOrderProductMutation();

  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    if (ordersData?.data) {
      const openOrder = ordersData.data.find((order: any) => order.orderStatus === "open");
      if (openOrder) {
        setCartItems(openOrder.details);
      } else {
        setCartItems([]);
      }
    }
  }, [ordersData]);

  const handleQuantityChange = async (productId: number, newQty: number) => {
    if (!newQty || newQty < 1) return;
    const openOrder = ordersData?.data.find((order: any) => order.orderStatus === "open");
    if (!openOrder) return;

    try {
      await addProductToOrder({
        orderId: openOrder.id,
        product: { productId, quantity: newQty },
      }).unwrap();

      setCartItems((prev) =>
        prev.map((item) => (item.productId === productId ? { ...item, quantity: newQty } : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (productId: number) => {
    const openOrder = ordersData?.data.find((order: any) => order.orderStatus === "open");
    if (!openOrder) return;

    try {
      await removeProductFromOrder({ orderId: openOrder.id, productId }).unwrap();

      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  if (isLoading) return <Text>Loading cart...</Text>;

  return (
    <VStack px={{ base: 4, md: 10 }} py={6}>
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
            {cartItems.map((item) => (
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
                  src={item.product?.thumbnail}
                  alt={item.product?.name}
                  borderRadius="md"
                  boxSize="100px"
                  objectFit="cover"
                />
                <VStack align="start" gap={1} flex="1">
                  <Text fontWeight="bold">{item.product?.name}</Text>
                  <Text>£{item.product?.price}</Text>
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
            ))}

            <HStack justifyContent="space-between">
              <Text fontSize="xl" fontWeight="bold">
                Total: £{totalPrice.toFixed(2)}
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
