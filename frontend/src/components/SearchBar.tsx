import { Box, Input } from "@chakra-ui/react";

interface SearchBarProps {
  searchQuery: string;
  onSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({ searchQuery, onSearchQuery: setSearchQuery }: SearchBarProps) {
  return (
    <Box mb={10} w={{ base: "100%", md: "50%" }} mx="auto">
      <Input
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        bg="gray.900"
        color="white"
        borderColor="purple.500"
      />
    </Box>
  )
}