import { Button, HStack, Text } from "@chakra-ui/react";

interface PaginationProps {
  page: number;
  onPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export default function Pagination({ page, onPage: setPage, totalPages }: PaginationProps) {
  return (
    <HStack gap={4}>
      <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
        Previous
      </Button>
      <Text>
        Page {page} of {totalPages || 1}
      </Text>
      <Button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages || totalPages === 0}
      >
        Next
      </Button>
    </HStack>
  );
}
