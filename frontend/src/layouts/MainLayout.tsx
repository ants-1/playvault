import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <Box bg="black" color="white" minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex="1" px={{ base: 4, md: 10 }} py={6}>
        <Outlet /> 
      </Box>
      <Footer />
    </Box>
  );
}
