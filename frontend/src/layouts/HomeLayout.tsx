import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box bg="black" color="white" minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex="1" m={0} p={0}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
