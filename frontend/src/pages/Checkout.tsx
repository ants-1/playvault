import { useState } from "react";
import { Box, Text, VStack, HStack, Input, Button, Flex } from "@chakra-ui/react";

export default function Checkout() {
  const [step, setStep] = useState(1);

  // Order info state
  const [orderEmail, setOrderEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderAddress, setOrderAddress] = useState("");

  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const orderDetails = [
    { productId: 1, name: "Wireless Headphones", price: 99.99, quantity: 1 },
    { productId: 2, name: "Phone Case", price: 19.99, quantity: 2 },
  ];

  const totalPrice = orderDetails.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleNext = () => {
    if (!orderEmail || !shippingAddress || !orderAddress) {
      alert("Please fill in all order information fields");
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handlePayment = () => {
    alert("Payment submitted!");
  };

  return (
    <VStack px={{ base: 4, md: 10 }} py={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Checkout
      </Text>

      <HStack mb={6} maxW="4xl" w="full">
        <Flex
          flex={1}
          justify="center"
          py={2}
          borderBottomWidth={step === 1 ? "3px" : "1px"}
          borderBottomStyle="solid"
          borderBottomColor={step === 1 ? "purple.500" : "gray.300"}
        >
          <Text fontWeight={step === 1 ? "bold" : "normal"}>1. Order Info</Text>
        </Flex>
        <Flex
          flex={1}
          justify="center"
          py={2}
          borderBottomWidth={step === 2 ? "3px" : "1px"}
          borderBottomStyle="solid"
          borderBottomColor={step === 2 ? "purple.500" : "gray.300"}
        >
          <Text fontWeight={step === 2 ? "bold" : "normal"}>2. Payment</Text>
        </Flex>
      </HStack>

      <VStack align="stretch" maxW="4xl" w="full" gap={6}>
        {/* Order Info Step */}
        {step === 1 && (
          <Box borderWidth="1px" borderRadius="md" borderColor="purple.500" p={4}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Order Information
            </Text>

            <VStack align="start" gap={3}>
              <VStack align="start" gap={1} w="full">
                <Text>Email</Text>
                <Input
                  placeholder="Enter your email"
                  value={orderEmail}
                  onChange={(e) => setOrderEmail(e.target.value)}
                />
              </VStack>

              <VStack align="start" gap={1} w="full">
                <Text>Shipping Address</Text>
                <Input
                  placeholder="Enter shipping address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </VStack>

              <VStack align="start" gap={1} w="full">
                <Text>Order Address</Text>
                <Input
                  placeholder="Enter order address"
                  value={orderAddress}
                  onChange={(e) => setOrderAddress(e.target.value)}
                />
              </VStack>
            </VStack>

            <Button color="purple.600" mt={4} onClick={handleNext}>
              Next: Payment
            </Button>
          </Box>
        )}

        {/* Payment Step */}
        {step === 2 && (
          <Box borderWidth="1px" borderRadius="md" borderColor="purple.500" p={4}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Payment
            </Text>

            <VStack align="stretch" borderWidth="1px" borderRadius="md" p={4} mb={4}>
              <Text fontWeight="bold" mb={2}>
                Your Order Information
              </Text>
              <Text>Email: {orderEmail}</Text>
              <Text>Shipping Address: {shippingAddress}</Text>
              <Text>Order Address: {orderAddress}</Text>
            </VStack>

            <VStack align="stretch" borderWidth="1px" borderRadius="md" p={4} mb={4}>
              <Text fontWeight="bold" mb={2}>
                Order Summary
              </Text>
              {orderDetails.map((item, idx) => (
                <HStack key={idx} justify="space-between">
                  <Text>{item.name}</Text>
                  <Text>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </Text>
                </HStack>
              ))}
              <HStack justify="space-between" mt={2}>
                <Text fontWeight="bold">Total</Text>
                <Text fontWeight="bold">${totalPrice.toFixed(2)}</Text>
              </HStack>
            </VStack>

            {/* Payment Form */}
            <VStack align="stretch" gap={4}>
              <VStack align="start" gap={1}>
                <Text>Cardholder Name</Text>
                <Input
                  placeholder="Name on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </VStack>

              <VStack align="start" gap={1}>
                <Text>Card Number</Text>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </VStack>

              <HStack gap={4}>
                <VStack align="start" gap={1} flex={1}>
                  <Text>Expiry</Text>
                  <Input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </VStack>
                <VStack align="start" gap={1} flex={1}>
                  <Text>CVC</Text>
                  <Input
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                  />
                </VStack>
              </HStack>

              <HStack gap={4} mt={4}>
                <Button onClick={handleBack}>Back</Button>
                <Button color="purple.600" onClick={handlePayment}>
                  Pay ${totalPrice.toFixed(2)}
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}
      </VStack>
    </VStack>
  );
}
