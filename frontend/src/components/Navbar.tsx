import { useEffect, useState } from "react";
import { Flex, Text, HStack, Box, Icon } from "@chakra-ui/react";
import { BiHome, BiShoppingBag, BiInfoSquare, BiUser, BiLogOut } from "react-icons/bi";
import { CgShoppingCart } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetOrdersQuery } from "../slices/orderApiSlice";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/userApiSlice";

const links = [
  { name: "Home", href: "/", icon: <BiHome size={20} /> },
  { name: "Shop", href: "/shop", icon: <BiShoppingBag size={20} /> },
  { name: "About Us", href: "/aboutus", icon: <BiInfoSquare size={20} /> },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: any) => state.auth);
  const userId = userInfo?.user.userId || userInfo?.user.id;
  const [cartItemCount, setCartItemCount] = useState(0);

  const { data: ordersData } = useGetOrdersQuery(
    { userId, page: 1, limit: 10 },
    {
      skip: !userInfo,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  useEffect(() => {
    if (ordersData?.data && Array.isArray(ordersData.data)) {
      const openOrder = ordersData.data.find(
        (order: any) => order.orderStatus === "open"
      );

      if (openOrder && Array.isArray(openOrder.details)) {
        setCartItemCount(openOrder.details.length);
      } else {
        setCartItemCount(0);
      }
    } else {
      setCartItemCount(0);
    }
  }, [ordersData]);

  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi(undefined);
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Flex
      h="16"
      bgColor="gray.900"
      px="6"
      alignItems="center"
      justifyContent="space-between"
      color="white"
    >
      <Text fontSize="xl" fontWeight="bold">
        <Box as="span">Play</Box>
        <Box as="span" color="purple.500">
          Vault
        </Box>
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
                <Text fontSize="sm">{link.name}</Text>
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
            {cartItemCount > 0 && (
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
            )}
          </Flex>
        </Link>

        {userInfo ? (
          <Icon _hover={{ color: "purple.500", cursor: "pointer" }} onClick={handleLogout}>
            <BiLogOut size={25} />
          </Icon>
        ) : (
          <Link to="/login">
            <Icon _hover={{ color: "purple.500", cursor: "pointer" }}>
              <BiUser size={25} />
            </Icon>
          </Link>
        )}
      </HStack>
    </Flex>
  );
}
