import { Flex, Text, HStack, Box } from "@chakra-ui/react";
import { BiHome, BiShoppingBag, BiInfoSquare, BiUser } from "react-icons/bi";
import { CgShoppingCart } from "react-icons/cg";
import { Link } from "react-router-dom";

const links = [
  { name: "Home", href: "/", icon: <BiHome size={20} /> },
  { name: "Shop", href: "/shop", icon: <BiShoppingBag size={20} /> },
  { name: "About Us", href: "/aboutus", icon: <BiInfoSquare size={20} /> }
];

export default function Navbar() {
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
        PlayVault
      </Text>

      <HStack gap="4">
        {links.map((link) => (
          <Link key={link.name} to={link.href}>
            <HStack>
              {link.icon}
              <Text>{link.name}</Text>
            </HStack>
          </Link>
        ))}
      </HStack>

      <HStack gap="4">
        <Link to="/cart">
          <Flex position="relative">
            <CgShoppingCart size={20} />
            <Box
              position="absolute"
              top="-2"
              right="-2"
              bg="red.500"
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
          <BiUser size={20} />
        </Link>
      </HStack>
    </Flex>
  );
}
