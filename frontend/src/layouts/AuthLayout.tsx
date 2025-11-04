import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Box bg="black" color="white" minH="100vh" display="flex" flexDirection="column">
      <Box flex="1" px={{ base: 4, md: 10 }} py={6}>
        <Outlet /> 
      </Box>
    </Box>
  );
}
