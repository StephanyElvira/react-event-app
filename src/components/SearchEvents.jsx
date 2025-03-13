import { useState } from "react";
import { Input, FormControl } from "@chakra-ui/react";

export const SearchEvents = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <FormControl maxW="300px">
      <Input
        id="search-input"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for event"
        size="sm"
        bg="white"
      />
    </FormControl>
  );
};
