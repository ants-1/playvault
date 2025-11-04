import { Flex, Text, HStack, Box, Icon } from "@chakra-ui/react";
import { BiHome, BiShoppingBag, BiInfoSquare, BiUser } from "react-icons/bi";
import { CgShoppingCart } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom";

const links = [
  { name: "Home", href: "/", icon: <BiHome size={20} /> },
  { name: "Shop", href: "/shop", icon: <BiShoppingBag size={20} /> },
  { name: "About Us", href: "/aboutus", icon: <BiInfoSquare size={20} /> }
];

export default function Navbar() {
  const location = useLocation();
  const cartItemCount = 3;

  return (
    <Flex
      h="14"
      bgColor="gray.900"
      px="6"
      alignItems="center"
      justifyContent="space-between"
      color="white"
    >
      <Text fontSize="xl" fontWeight="bold">
        <Box as="span">Play</Box>
        <Box as="span" color="purple.500">Vault</Box>
      </Text>

      <HStack gap="4">
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link key={link.name} to={link.href}>
              <Flex
                align="center"
                gap="1"
                color={isActive ? "purple.700" : "white"}
                _hover={{ color: "purple.500" }}
                transition="color 0.2s"
              >
                {link.icon}
                <Text>{link.name}</Text>
              </Flex>
            </Link>
          );
        })}
      </HStack>

      <HStack gap="4">
        <Link to="/cart">
          <Flex position="relative">
            <Icon _hover={{ color: "purple.500" }}>
              <CgShoppingCart size={25} />
            </Icon>
            <Box
              position="absolute"
              top="-2"
              right="-2"
              bg="purple.500"
              borderRadius="full"
              w="4"
              h="4"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xs" color="white">
                {cartItemCount}
              </Text>
            </Box>
          </Flex>
        </Link>
        <Link to="/login">
          <Icon _hover={{ color: "purple.500" }}>
            <BiUser size={25} />
          </Icon>
        </Link>
      </HStack>
    </Flex>
  );
}
