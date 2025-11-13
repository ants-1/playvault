import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { VStack, Box, Text, Input, Button, HStack } from "@chakra-ui/react";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "../slices/orderApiSlice";
import { clearCart } from "../slices/cartSlice";
import { Toaster, toaster } from "../components/ui/toaster";

export default function Checkout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);
  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user.userId || userInfo?.user.id;

  const [step, setStep] = useState(1);
  const [orderEmail, setOrderEmail] = useState(userInfo?.user.email || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const totalPrice = cartItems.reduce(
    (acc: number, item: { price: number; quantity: number }) =>
      acc + item.price * item.quantity,
    0
  );

  const { data: ordersData, refetch } = useGetOrdersQuery(
    { userId, page: 1, limit: 10 },
    { skip: !userInfo }
  );

  const [updateOrder] = useUpdateOrderMutation();

  const openOrder = ordersData?.data.find((order: any) => order.orderStatus === "open");

  const handleNext = () => {
    if (!orderEmail || !shippingAddress || !orderAddress) {
      toaster.create({ description: "Please fill all order info", type: "error" });
      return;
    }
    setStep(2);
  };

  const handlePayment = async () => {
    if (!userId) {
      toaster.create({ description: "You must be logged in to place an order", type: "error" });
      return;
    }

    if (cartItems.length === 0) {
      toaster.create({ description: "Cart is empty", type: "error" });
      return;
    }

    console.log("handlePayment called", { userId, cartItems, openOrder });

    try {
      if (openOrder) {
        console.log("Updating existing order:", openOrder.id);

        const updatePayload = {
          orderStatus: "completed",
          shippingAddress,
          orderAddress,
        };
        console.log("Updating playload:", updatePayload);

        const updatedOrder = await updateOrder({
          orderId: openOrder.id,
          ...updatePayload
        }).unwrap();
        console.log("Order updated:", updatedOrder);

      }

      await refetch();

      dispatch(clearCart());

      toaster.create({ description: "Payment successful! Order completed.", type: "success" });
    } catch (err: any) {
      console.error("Payment error:", err);
      toaster.create({
        description: err?.data?.message || err.message || "Failed to complete order",
        type: "error",
      });
    }
  };

  return (
    <VStack px={10} py={6}>
      <Toaster />
      <Text fontSize="2xl" fontWeight="bold">Checkout</Text>

      <VStack align="stretch" gap={6} maxW="4xl" w="full">
        {step === 1 && (
          <Box p={4} borderWidth="1px" borderColor="purple.500" borderRadius="md">
            <Text fontWeight="bold" fontSize="lg" mb={4}>Order Information</Text>
            <Input
              placeholder="Email"
              value={orderEmail}
              onChange={(e) => setOrderEmail(e.target.value)}
              mb={2}
            />
            <Input
              placeholder="Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              mb={2}
            />
            <Input
              placeholder="Order Address"
              value={orderAddress}
              onChange={(e) => setOrderAddress(e.target.value)}
            />
            <Button colorScheme="purple" mt={4} onClick={handleNext}>
              Next: Payment
            </Button>
          </Box>
        )}

        {step === 2 && (
          <Box p={4} borderWidth="1px" borderColor="purple.500" borderRadius="md">
            <Text fontWeight="bold" fontSize="lg" mb={4}>Order Summary</Text>
            {cartItems.map((item: any) => (
              <HStack key={item.productId} justify="space-between">
                <Text>{item.name}</Text>
                <Text>{item.quantity} x £{item.price.toFixed(2)}</Text>
              </HStack>
            ))}
            <HStack justify="space-between" mt={2}>
              <Text fontWeight="bold">Total</Text>
              <Text fontWeight="bold">£{totalPrice.toFixed(2)}</Text>
            </HStack>

            <Text
              fontWeight="bold"
              mt={4}
              pt="4"
              pb="4"
              borderTop="1px solid"
              borderColor="gray.700"
              fontSize="lg"
            >
              Payment Info
            </Text>
            <Input
              placeholder="Cardholder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              mb={2}
            />
            <Input
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              mb={2}
            />
            <HStack gap={2}>
              <Input
                placeholder="Expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <Input
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </HStack>

            <HStack mt={4} gap={4}>
              <Button onClick={() => setStep(1)}>Back</Button>
              <Button colorScheme="purple" onClick={handlePayment} loading={false}>
                Pay £{totalPrice.toFixed(2)}
              </Button>
            </HStack>
          </Box>
        )}
      </VStack>
    </VStack>
  );
}
