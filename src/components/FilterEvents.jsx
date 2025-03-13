import { FormControl, Select } from "@chakra-ui/react";

export const FilterEvents = ({ onFilter, categories, selectedCategory }) => {
  const handleFilter = (e) => {
    const categoryId = e.target.value ? Number(e.target.value) : "";
    onFilter(categoryId);
  };

  return (
    <FormControl mb={4} maxW="300px">
      <Select
        value={selectedCategory}
        onChange={handleFilter}
        size="sm"
        bg="white"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
