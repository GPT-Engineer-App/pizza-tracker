import React, { useState } from "react";
import { Box, Button, Container, Heading, VStack, HStack, Text, Progress, useToast, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react";
import { FaClock, FaMotorcycle, FaPizzaSlice } from "react-icons/fa";

// Helper function to format time in MM:SS format
const formatTime = (seconds) => {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
};

const Index = () => {
  const [orders, setOrders] = useState([]);
  const toast = useToast();

  const handleStartOrder = () => {
    const newOrder = {
      id: Math.random().toString(36).substring(7),
      startTime: Date.now(),
      endTime: null,
      status: "preparing",
    };
    setOrders([...orders, newOrder]);
  };

  const handleFinishOrder = (orderId) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, endTime: Date.now(), status: "ready for delivery" } : order)));
  };

  const handleDeliverOrder = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    toast({
      title: "Order delivered!",
      description: "The pizza has been successfully delivered.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  // Calculate average delivery time in seconds
  const averageTime =
    orders.reduce((acc, order) => {
      return order.endTime ? acc + (order.endTime - order.startTime) / 1000 : acc;
    }, 0) / (orders.filter((order) => order.endTime).length || 1);

  return (
    <Container maxW="container.xl" p={5}>
      <VStack spacing={5}>
        <Heading as="h1" size="xl">
          Pizzeria Time Tracker
        </Heading>
        <Button leftIcon={<FaPizzaSlice />} colorScheme="orange" onClick={handleStartOrder}>
          Start New Order
        </Button>

        <Box w="full">
          {orders.map((order) => (
            <Box key={order.id} borderWidth="1px" borderRadius="lg" p={4} mb={4}>
              <HStack justifyContent="space-between">
                <HStack>
                  <FaClock />
                  <Text fontSize="lg">
                    Order ID: {order.id} - {formatTime((Date.now() - order.startTime) / 1000)} elapsed
                  </Text>
                </HStack>
                {order.status === "preparing" ? (
                  <Button leftIcon={<FaMotorcycle />} colorScheme="green" onClick={() => handleFinishOrder(order.id)}>
                    Finish Order
                  </Button>
                ) : (
                  <Button leftIcon={<FaMotorcycle />} colorScheme="red" onClick={() => handleDeliverOrder(order.id)}>
                    Deliver Order
                  </Button>
                )}
              </HStack>
              {order.status === "ready for delivery" && (
                <Alert status="warning" mt={4}>
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle>Ready for Delivery!</AlertTitle>
                    <AlertDescription display="block">This order is ready to be delivered.</AlertDescription>
                  </Box>
                  <CloseButton position="absolute" right="8px" top="8px" />
                </Alert>
              )}
            </Box>
          ))}
        </Box>

        <Box w="full">
          <Text fontSize="xl">Average Delivery Time: {formatTime(averageTime)}</Text>
          <Progress value={(averageTime / (60 * 60)) * 100} size="lg" colorScheme="green" />
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
