import {
  Portal,
  Select,
} from "@chakra-ui/react";

interface SortDropdownProps {
  sortOptions: any;
  sortValue: any;
  onSortValue: any;
}

export default function SortDropdown({ sortOptions, sortValue, onSortValue }: SortDropdownProps) {
  return (
    <Select.Root
      collection={sortOptions}
      width="200px"
      mb={10}
      bg="gray.900"
      value={sortValue}
      onValueChange={(e) => onSortValue(e.value)}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Sort products" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {sortOptions.items.map((option: any) => (
              <Select.Item item={option} key={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}